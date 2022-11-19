import cardUtil from './cardUtil.js'


function Deck(cardLookup) {
  // Serialized Data
  this._id = undefined
  this.userId = ''
  this.name = ''
  this.path = ''
  this.createdTimestamp = Date.now()
  this.updatedTimestamp = this.createdTimestamp
  this.cardlist = ''

  this.cardLookup = cardLookup
  this.breakdown = {
    main: [],
    side: [],
    command: [],
  }
  this.modified = false
}

export default {
  Deck,

  buildHierarchy,
  deserialize,
  pathTokens,
}


function deserialize(data, cardLookup) {
  const deck = new Deck()

  deck._id = data._id
  deck.userId = data.userId
  deck.name = data.name
  deck.path = data.path
  deck.createdTimestamp = data.createdTimestamp
  deck.updatedTimestamp = data.updatedTimestamp

  deck.cardLookup = cardLookup
  deck.setCardlist(data.cardlist)

  return deck
}

Deck.prototype.serialize = function() {
  const data = {
    userId: this.userId,
    name: this.name,
    path: this.path,
    createdTimestamp: this.createdTimestamp,
    updatedTimestamp: this.updatedTimestamp,
    cardlist: this.cardlist,
  }

  if (this._id) {
    data._id = this._id
  }

  return data
}

Deck.prototype.setBreakdown = function(breakdown) {
  this.breakdown = breakdown
  injectCardData(this.breakdown, this.cardLookup)
  this.cardlist = breakdownToCardlist(breakdown)
}

Deck.prototype.setCardlist = function(cardlist) {
  this.cardlist = cardlist
  this.breakdown = cardUtil.parseCardlist(cardlist)
  injectCardData(this.breakdown, this.cardLookup)
}


////////////////////////////////////////////////////////////////////////////////
// Helper Functions

const zoneNameLookup = {
  main: 'Deck',
  side: 'Sideboard',
  command: 'Command',
}

function breakdownToCardlist(breakdown) {
  const lines = []
  const zones = ['main', 'side', 'command']

  for (const zone of zones) {
    if (breakdown[zone].length > 0) {
      if (lines.length > 0) {
        lines.push('')
      }
      lines.push(zoneNameLookup[zone])
    }

    for (const data of breakdown[zone]) {
      const tokens = []
      tokens.push(data.count)
      tokens.push(data.name)
      if (data.setCode) {
        tokens.push(`(${data.setCode})`)
        tokens.push(data.collectorNumber)
      }
      lines.push(tokens.join(' '))
    }
  }

  if (lines[lines.length - 1] === '') {
    lines.pop()
  }

  return lines.join('\n')
}

function pathTokens(path) {
  let tokens = path ? path.split('/') : []
  if (path.length > 0 && path[0].length === 0) {
    tokens = tokens.splice(0, 1)
  }

  return tokens.filter(t => Boolean(t))
}

function buildHierarchy(deckData) {
  const hierarchy = [{
    name: 'root',
    pwd: '/',
    folders: [],
    decks: [],
  }]

  let node
  for (const datum of deckData) {
    node = hierarchy[0]  // start at the root node

    for (const elem of pathTokens(datum.path)) {
      const folder = node.folders.find(f => f.name === elem)
      if (folder) {
        node = folder
        continue
      }
      else {
        const newFolder = {
          name: elem,
          pwd: node.pwd === '/' ? node.pwd + elem : node.pwd + '/' + elem,
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

// Add refs to full card data, if available.
function injectCardData(breakdown, cardLookup) {
  if (cardLookup) {
    for (const zone of Object.values(breakdown)) {
      for (const elem of zone) {
        elem.card = (cardLookup[elem.name] || [])[0]
      }
    }
  }
}
