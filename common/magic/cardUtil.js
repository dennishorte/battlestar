const util = require('../lib/util.js')

const CardUtil = {
  id: require('./cardId.js'),
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

CardUtil.colorKey = function(colors) {
  return colors.map(c => c.toLowerCase()).sort().join('')
}

CardUtil.cmc = function(card) {
  if (card.data) {
    card = card.data
  }
  else {
    return 0
  }
  return card.cmc
}

CardUtil.supertypes = function(card) {
  if (card.type_line) {
    // do nothing
  }
  else if (card.data) {
    card = card.data
  }
  else {
    return []
  }

  return card
    .type_line
    .split(' // ')
    .map(cardType => cardType.split(CardUtil.TYPE_DIVIDER)[0].split(' '))
    .flat()
    .map(kind => kind.toLowerCase())
}

CardUtil.identity = function(card) {
  if (card.data) {
    card = card.data
  }
  else {
    return []
  }
  return card.color_identity
}

CardUtil.colors = function(card) {
  if (card.data) {
    card = card.data
  }
  else {
    return []
  }
  return card.colors
}

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

const numberFields = ['cmc', 'power', 'toughness', 'loyalty', 'defense']
const textFields = ['name', 'text', 'flavor', 'set', 'type']
const fieldMapping = {
  cmc: 'cmc',
  colors: 'colors',
  defense: 'defense',
  flavor: 'flavor_text',
  identity: 'color_identity',
  loyalty: 'loyalty',
  name: 'name',
  power: 'power',
  set: 'set',
  text: 'oracle_text',
  toughness: 'toughness',
  type: 'type_line',
}
const colorNameToSymbol = {
  white: 'W',
  blue: 'U',
  black: 'B',
  red: 'R',
  green: 'G',
}

CardUtil.filtersMatchCard = function(filters, card) {
  return filters.every(filter => CardUtil.applyOneFilter(card, filter))
}

CardUtil.applyOneFilter = function(card, filter) {
  if (card.data) {
    card = card.data
  }

  if (filter.kind === 'legality') {
    return 'legal' in card && card.legal.includes(filter.value)
  }
  else if (filter.kind === 'colors' || filter.kind === 'identity') {
    const fieldKey = fieldMapping[filter.kind]
    const fieldValue = fieldKey in card ? card[fieldKey] : []
    const targetValueMatches = ['white', 'blue', 'black', 'red', 'green']
      .map(color => filter[color] ? colorNameToSymbol[color] : undefined)
      .filter(symbol => symbol !== undefined)
      .map(symbol => fieldValue.includes(symbol))

    if (filter.or) {
      if (filter.only) {
        return (
          targetValueMatches.some(x => x)
          && fieldValue.length === targetValueMatches.filter(x => x).length
        )
      }
      else {
        return targetValueMatches.some(x => x)
      }
    }
    else {  // and
      if (filter.only) {
        return (
          targetValueMatches.every(x => x)
          && fieldValue.length === targetValueMatches.length
        )
      }
      else {
        return targetValueMatches.every(x => x)
      }
    }
  }
  else if (textFields.includes(filter.kind)) {
    const fieldKey = fieldMapping[filter.kind]

    const fieldValues = []

    if (fieldKey in card) {
      fieldValues.push(card[fieldKey])
    }
    else {
      for (const face of card.card_faces) {
        if (fieldKey in face) {
          fieldValues.push(face[fieldKey])
        }
      }
    }

    if (filter.operator === 'or') {
      const fieldValue = fieldValues.map(v => v.toLowerCase())
      const targetValues = filter.value.map(v => v.toLowerCase())
      return targetValues.some(v => fieldValue.includes(v))
    }

    else {
      const fieldValue = fieldValues.join(' ').toLowerCase()
      const targetValue = filter.value.toLowerCase()

      if (filter.operator === 'and') {
        return fieldValue.includes(targetValue)
      }
      else if (filter.operator === 'not') {
        return !fieldValue.includes(targetValue)
      }
      else {
        throw new Error(`Unhandled string operator: ${filter.operator}`)
      }
    }
  }
  else if (numberFields.includes(filter.kind)) {
    const fieldKey = fieldMapping[filter.kind]
    const targetValue = parseFloat(filter.value)

    let fieldValues = []
    if (fieldKey in card) {
      fieldValues.push(card[fieldKey])
    }
    else {
      for (const face of card.card_faces) {
        if (fieldKey in face) {
          fieldValues.push(face[fieldKey])
        }
      }
    }
    fieldValues = fieldValues.map(val => parseFloat(val))


    return fieldValues.some(fieldValue => {
      if (fieldValue === -999) {
        return false
      }
      else if (filter.operator === '=') {
        return fieldValue === targetValue
      }
      else if (filter.operator === '>=') {
        return fieldValue >= targetValue
      }
      else if (filter.operator === '<=') {
        return fieldValue <= targetValue
      }
      else {
        throw new Error(`Unhandled numeric operator: ${filter.operator}`)
      }
    })
  }
  else {
    throw new Error(`Unhandled filter field: ${filter.kind}`)
  }

  return false
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

CardUtil.equals = function(a, b) {
  return this.softEquals(a, b)
}

CardUtil.softEquals = function(a, b) {
  const aName = a.name.split(' // ')[0].toLowerCase()
  const bName = b.name.split(' // ')[0].toLowerCase()

  return aName === bName
}

CardUtil.strictEquals = function(a, b) {
  return (
    a.name === b.name
    && a.set == b.set
    && a.collector_number === b.collector_number
  )
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

CardUtil.isLand = function(card) {
  if (card.data) {
    card = card.data
  }
  else {
    return false
  }
  return card.type_line.toLowerCase().includes('land')
}

CardUtil.isArtifact = function(card) {
  if (card.data) {
    card = card.data
  }
  else {
    return false
  }
  return card.type_line.toLowerCase().includes('artifact')
}

CardUtil.isScarred = function(card) {
  return Boolean(card.custom_id)
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

CardUtil.frameColor = function(card) {
  if (card.colors.length === 1) {
    switch (card.colors[0].toUpperCase()) {
      case 'R': return 'red';
      case 'W': return 'white';
      case 'U': return 'blue';
      case 'G': return 'green';
      case 'B': return 'black';
      default:
        throw new Error('Unknown single color: ' + card.colors[0])
    }
  }

  else if (card.colors.length > 1) {
    return 'gold'
  }

  else if (this.isLand(card)) {
    return 'land'
  }

  else {
    return 'artifact'
  }
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

// Return true if the playable stats are the same, false otherwise.
CardUtil.playableStatsEquals = function(a, b) {
  const topEquals = (
    a.name === b.name
    && a.layout === b.layout
    && a.type_line === b.type_line
    && a.cmc === b.cmc
    && a.card_faces.length === b.card_faces.length
  )

  if (!topEquals) {
    return false
  }

  for (let i = 0; i < a.card_faces.length; i++) {
    const af = a.card_faces[i]
    const bf = b.card_faces[i]

    const faceEquals = (
      af.name === bf.name
      && af.oracle_text === bf.oracle_text
      && af.type_line === bf.type_line
      && af.mana_cost === bf.mana_cost
      && af.defense === bf.defense
      && af.loyalty === bf.loyalty
      && af.power === bf.power
      && af.toughness === bf.toughness
    )

    if (!faceEquals) {
      return false
    }
  }

  return true
}
