const util = require('../lib/util.js')

const CardUtil = {
  lookup: require('./cardLookup.js'),
}
module.exports = CardUtil


CardUtil.TYPE_DIVIDER = ' \u2014 '

CardUtil.COLORS = ['white', 'blue', 'black', 'red', 'green']

CardUtil.COLOR_KEY_TO_NAME = {
  '': 'colorless',
  w: 'white',
  u: 'blue',
  b: 'black',
  r: 'red',
  g: 'green',

  uw: 'azorius',
  rw: 'boros',
  bu: 'dimir',
  bg: 'golgari',
  gr: 'gruul',
  ru: 'izzet',
  bw: 'orzhov',
  br: 'rakdos',
  gw: 'selesnya',
  gu: 'simic',

  bgw: 'abzan',
  guw: 'bant',
  buw: 'esper',
  bru: 'grixis',
  ruw: 'jeskai',
  bgr: 'jund',
  brw: 'mardu',
  grw: 'naya',
  bgu: 'sultai',
  gru: 'temur',

  bguw: 'non-red',
  bruw: 'non-green',
  bgru: 'non-white',
  bgrw: 'non-blue',
  gruw: 'non-black',

  bgruw: 'five-color',
}

CardUtil.colorSymbolToName = function(symbol) {
  switch (symbol.toLowerCase()) {
    case 'w': return 'white';
    case 'u': return 'blue';
    case 'b': return 'black';
    case 'r': return 'red';
    case 'g': return 'green';
    default:
      throw new Error('Invalid color symbol: ' + symbol)
  }
}

CardUtil.sortTypes = [
  'land',
  'creature',
  'planeswalker',
  'enchantment',
  'artifact',
  'instant',
  'sorcery',
]

CardUtil.calculateManaCost = function(card) {
  const symbolRegex = /[{]([^{}]+)[}]/g
  const numberRegex = /^[0-9]+$/
  const convertCastingCostToManaCost = (manaString) => {
    if (!manaString) {
      return 0
    }

    return [...manaString.matchAll(symbolRegex)]
      .map(match => match[1])
      .map(symbol => {
        symbol = symbol.toUpperCase()

        if (symbol.match(numberRegex)) {
          return parseInt(symbol)
        }
        else if (symbol === 'X' || symbol === 'Y' || symbol === 'Z') {
          return 0
        }
        else {
          return 1
        }
      })
      .reduce((acc, x) => acc + x, 0)
  }

  const mainCardLayouts = ['adventure', 'prototype', 'modal_dfc']

  if (mainCardLayouts.includes(card.layout)) {
    // Exclude everything except the main card
    return convertCastingCostToManaCost(card.card_faces[0].mana_cost)
  }
  else {
    return card
      .card_faces
      .map(face => convertCastingCostToManaCost(face.mana_cost))
      .reduce((acc, next) => acc + next, 0)
  }
}

CardUtil.blankFace = function() {
  return {
    artist: '',
    defense: '',
    flavor_text: '',
    image_uri: '',
    loyalty: '',
    mana_cost: '',
    name: '',
    oracle_text: '',
    power: '',
    toughness: '',
    type_line: '',

    color_identity: [],
    color_indicator: null,
    colors: [],
    produced_mana: [],
  }
}

CardUtil.blank = function() {
  return {
    card_faces: [this.blankFace()],

    id: '',
    layout: 'normal',
    rarity: 'common',
    set: '',
    collector_number: '',
    legal: [],

    name: '',
    type_line: '',

    cmc: '0',
    color_identity: [],
    colors: [],
    produced_mana: [],
  }
}

CardUtil.getSortType = function(card) {
  if (card) {
    const typeline = card.card_faces[0].type_line.toLowerCase()

    for (const sortType of this.sortTypes) {
      if (typeline.includes(sortType)) {
        return sortType
      }
    }
  }

  return 'other'
}

CardUtil.parseRulesLine = function(line) {
  const output = {
    isScar: false,
    parts: [],
  }

  const newPart = () => ({
    type: 'text',
    text: '',
  })

  if (line.startsWith('+ ')) {
    output.isScar = true
    line = line.slice(2)
  }

  let part = newPart()

  const close = () => {
    if (part.text) {
      output.parts.push(part)
      part = newPart()
    }
  }

  for (let i = 0; i < line.length; i++) {
    const ch = line.charAt(i)

    if (ch === ')') {
      if (part.type !== 'reminder') {
        throw new Error('text parse error: unmatched close paren')
      }
      close()
    }

    else if (part.type === 'reminder') {
      part.text += ch
    }

    else if (ch === '(') {
      if (part.type === 'reminder') {
        throw new Error('text parse error: already in a reminder')
      }
      close()
      part.type = 'reminder'
    }

    else if (ch === '{') {
      if (part.type === 'symbol') {
        throw new Error('text parse error: already in a symbol')
      }
      close()
      part.type = 'symbol'
    }

    else if (ch === '}') {
      if (part.type !== 'symbol') {
        throw new Error('text parse error: unmatched close curly')
      }
      part.text = this.manaSymbolFromString(part.text)
      close()
    }

    else {
      part.text += ch
    }
  }

  close()

  return output
}

CardUtil.parseOracleText = function(text) {
  if (!text) {
    return []
  }

  const output = []

  for (const line of text.split('\n')) {
    try {
      output.push(this.parseRulesLine(line))
    }
    catch (e) {
      console.log(e.message)
      output.push({
        parts: [{
          type: 'parse_error',
          text: line,
        }]
      })
    }
  }

  return output
}

CardUtil.manaSymbolFromString = function(text) {
  text = text.toLowerCase()

  if (text.charAt(0) === '{' && text.charAt(text.length-1) === '}') {
    text = text.substr(1, text.length-2)
  }

  if (text == '1/2') {
    return 'ms-1-2'
  }
  else {
    text = text.replace('/', '').toLowerCase().trim()

    if (text == 't') {
      return 'tap'
    }
    else if (text == 'q') {
      return 'untap'
    }
    else if (text == 'inf') {
      return 'infinity'
    }
    else {
      if (['uw', 'wg', 'gr', 'rb', 'bu', 'w2', 'u2', 'b2', 'r2', 'g2'].indexOf(text) >= 0) {
        text = util.stringReverse(text)
      }

      return text
    }
  }
}

CardUtil.manaSymbolsFromString = function(string) {
  string = string.toLowerCase()

  var curr = ''
  let symbols = []

  for (var i = 0; i < string.length; i++) {
    let ch = string.charAt(i)
    curr += ch

    if (ch == '}') {
      symbols.push(this.manaSymbolFromString(curr))
      curr = ''
    }
  }

  return symbols
}

CardUtil.updateColors = function(card) {
  for (const face of card.card_faces) {
    if (face.mana_cost) {
      face.mana_cost = face.mana_cost.toUpperCase()
    }

    // Most cards have no color indicator; you can see it in cards like Pact of Negation.
    if (face.color_indicator) {
      face.colors = [...face.color_indicator]
    }
    else if (face.mana_cost) {
      face.colors = ['W', 'U', 'B', 'R', 'G'].filter(letter => face.mana_cost.includes(letter))
    }
    else {
      face.colors = []
    }
  }

  card.colors = util.array.distinct(card.card_faces.flatMap(face => face.colors))
  card.color_identity = [...card.colors]
}

CardUtil.parseCardlist = function(cardlist) {
  const cards = []

  let zoneName = 'main'

  const normalizedLines = cardlist
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")  // Replace single smart quotes with normal quotes
    .replace(/[\u201C\u201D]/g, '"')  // Replace double smart quotes with normal quotes
    .split('\n')

  for (let line of normalizedLines) {
    line = line.trim()

    if (line.endsWith(':')) {
      line = line.slice(0, line.length - 1)
    }

    if (line.length === 0) {
      continue
    }
    else if (line === 'deck' || line === 'main' || line === 'maincard') {
      zoneName = 'main'
    }
    else if (line === 'side' || line === 'sideboard') {
      zoneName = 'side'
    }
    else if (line === 'command' || line === 'commander') {
      zoneName = 'command'
    }
    else {
      const card = parseCardListLine(line)
      card.zone = zoneName

      const count = card.count
      delete card.count

      if (count === -1) {
        card.remove = true
        cards.push(card)
      }
      else {
        for (let i = 0; i < count; i++) {
          cards.push({ ...card })
        }
      }
    }
  }

  return cards
}

function parseCardListLine(line0) {
  const [line1, count] = parseCardLineCount(line0)
  const data = parseCardLineName(line1)
  data.count = count
  return data
}

function parseCardLineCount(line) {
  if (line.charAt(0) === '-') {
    return [line.slice(1).trim(), -1]
  }

  else if (line.charAt(0) === '+') {
    return [line.slice(1).trim(), 1]
  }

  // Card has a count in front of it
  else if (util.isDigit(line.charAt(0))) {
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

function parseCardLineName(line) {
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
