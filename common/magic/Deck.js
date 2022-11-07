const util = require('../lib/util.js')


function Deck() {
  // Serialized Data
  this._id = undefined
  this.userId = ''
  this.name = ''
  this.path = ''
  this.createdTimestamp = Date.now()
  this.updatedTimestamp = this.createdTimestamp
  this.decklist = ''

  // Extra Data
  this.breakdown = {}
}

module.exports = {
  Deck,

  buildHierarchy,
  deserialize,
  parseDecklist,
}


function deserialize(data, cardLookup) {
  const deck = new Deck()

  deck._id = data._id
  deck.userId = data.userId
  deck.name = data.name
  deck.path = data.path
  deck.createdTimestamp = data.createdTimestamp
  deck.updatedTimestamp = data.updatedTimestamp
  deck.decklist = data.decklist

  // Extra data
  deck.breakdown = parseDecklist(deck.decklist)

  // Add refs to full card data, if available.
  if (cardLookup) {
    for (const zone of Object.values(deck.breakdown)) {
      for (const elem of zone) {
        elem.card = (cardLookup[elem.name] || [])[0]
      }
    }
  }

  return deck
}

Deck.prototype.serialize = function() {
  this.updateDecklist()

  return {
    _id: this._id,
    userId: this.userId,
    name: this.name,
    path: this.path,
    createdTimestamp: this.createdTimestamp,
    updatedTimestamp: this.updatedTimestamp,
    decklist: this.decklist,
  }
}

Deck.prototype.updateDecklist = function() {
  throw new Error('not implemented')
}



////////////////////////////////////////////////////////////////////////////////
// Helper Functions

function buildHierarchy(deckData) {
  const hierarchy = [{
    name: 'root',
    folders: [],
    decks: [],
  }]

  let node
  for (const datum of deckData) {
    node = hierarchy[0]  // start at the root node

    const path = datum.path ? datum.path.split('/') : []

    for (const elem of path) {
      const folder = node.folders.find(f => f.name === elem)
      if (folder) {
        node = folder
        continue
      }
      else {
        const newFolder = {
          name: elem,
          folders: [],
          decks: [],
        }
        node.folders.push(newFolder)
        node = newFolder
        continue
      }
    }

    node.decks.push(datum)
  }

  return hierarchy
}

function parseDecklist(decklist) {
  const cards = {
    main: [],
    side: [],
    command: [],
  }

  let zone = null

  for (let line of decklist.toLowerCase().split('\n')) {
    line = line.trim()

    if (line.endsWith(':')) {
      line = line.slice(0, line.length - 1)
    }

    if (line.length === 0) {
      continue
    }
    else if (line === 'deck' || line === 'main' || line === 'maindeck') {
      zone = cards.main
    }
    else if (line === 'side' || line === 'sideboard') {
      zone = cards.side
    }
    else if (line === 'command' || line === 'commander') {
      zone = cards.command
    }
    else {
      zone.push(parseDeckListLine(line))
    }
  }

  return cards
}

function parseDeckListLine(line0) {
  const [line1, count] = parseDeckLineCount(line0)
  const data = parseDeckLineName(line1)
  data.count = count
  return data
}

function parseDeckLineCount(line) {
  // Card has a count in front of it
  if (util.isDigit(line.charAt(0))) {
    const firstSpaceIndex = line.indexOf(' ')
    const count = parseInt(line.slice(0, firstSpaceIndex))
    const name = line.slice(firstSpaceIndex + 1)
    return [name, count]
  }

  // Just a card name, with no count in front
  else {
    return [line, 1]
  }
}

function parseDeckLineName(line) {
  const tokens = line.split(' ')
  const output = {
    name: line,
    setCode: null,
    collectorNumber: null,
  }

  if (tokens.length < 3) {
    return output
  }

  const lastToken = tokens[tokens.length - 1]
  if (!util.isDigit(lastToken.charAt(0))) {
    return output
  }

  const penultimateToken = tokens[tokens.length - 2]
  if (penultimateToken.slice(0, 1) === '(' && penultimateToken.slice(-1) === ')') {
    output.name = tokens.slice(0, -2).join(' ')
    output.setCode = penultimateToken.slice(1, -1)
    output.collectorNumber = lastToken
  }

  return output
}
