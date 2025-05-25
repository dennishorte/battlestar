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
    case 'w': return 'white'
    case 'u': return 'blue'
    case 'b': return 'black'
    case 'r': return 'red'
    case 'g': return 'green'
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

    color_indicator: [],
    produced_mana: [],

    scarred: false,
  }
}

CardUtil.blank = function() {
  return {

    id: '',
    source: 'adhoc_token',

    data: {
      id: '',

      layout: 'normal',
      digital: false,
      rarity: 'common',

      card_faces: [this.blankFace()],

      legal: [],
    }
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
    return 'ms-half'
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
  return CardUtil
    .extractSymbolsFromText(string.toLowerCase())
    .map(symbol => CardUtil.manaSymbolFromString(symbol))
}

CardUtil.extractSymbolsFromText = function(string) {
  const matches = string.match(/\{([^{}]+)\}/g)
  if (!matches) {
    return []
  }

  return matches
    .map(x => x.slice(1, -1))
    .filter(symbol => symbol.trim().length > 0 )
}

// Mana cost string should be in the format {2}{U}.
// This function is case insenstive.
// Split mana symbols can include or exclude the slash. eg. {G/U} or {gu} are fine.
// Extra symbols are ignored, so you can pass in multiple mana costs with a divider to
// get the total. eg. {3}{R} // {R/G}
CardUtil.manaCostFromCastingCost = function(string) {
  const symbols = CardUtil.extractSymbolsFromText(string.toLowerCase())
  let total = 0

  for (const symbol of symbols) {
    if (['x', 'y', 'z'].includes(symbol)) {
      total += 0
    }
    else if (util.isDigits(symbol)) {
      total += parseInt(symbol)
    }
    else if (symbol[0] === '2') {
      total += 2
    }
    else {
      total += 1
    }
  }

  return total
}

// What is the sort order?
// First, X Y Z, then amount of colorless.
// Colored symbols are sorted wubrg, treated as a cirle, with the start symbol chosen to minimize the
// distance around the circle traveled to cover all of the symbols.
// So, gw is preferred over wg, and ur over ru.
CardUtil.sortManaArray = function(manaArray) {
  if (!Array.isArray(manaArray) || manaArray.length === 0) {
    return manaArray
  }

  // Helper function to extract first color from complex symbols
  function getFirstColor(symbol) {
    const colorOrder = 'wubrg'
    for (let char of symbol.toLowerCase()) {
      if (colorOrder.includes(char)) {
        return char
      }
    }
    return null
  }

  // Helper function to categorize mana symbols
  function categorizeMana(symbol) {
    const str = symbol.toString().toLowerCase()

    if (['x', 'y', 'z'].includes(str)) {
      return { type: 'variable', symbol: str, sortKey: str }
    }

    if (/^\d+$/.test(str)) {
      return { type: 'colorless', symbol: str, sortKey: parseInt(str) }
    }

    const firstColor = getFirstColor(str)
    if (firstColor) {
      return { type: 'colored', symbol: str, color: firstColor, sortKey: str }
    }

    // Fallback for unknown symbols
    return { type: 'unknown', symbol: str, sortKey: str }
  }

  // Categorize all mana symbols
  const categorized = manaArray.map(categorizeMana)

  // Separate by type
  const variables = categorized.filter(m => m.type === 'variable')
  const colorless = categorized.filter(m => m.type === 'colorless')
  const colored = categorized.filter(m => m.type === 'colored')
  const unknown = categorized.filter(m => m.type === 'unknown')

  // Sort variables (x, y, z)
  variables.sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  // Sort colorless by numeric value
  colorless.sort((a, b) => a.sortKey - b.sortKey)

  // Sort unknown alphabetically
  unknown.sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  // Optimize colored mana ordering
  function optimizeColorOrder(coloredMana) {
    if (coloredMana.length <= 1) {
      return coloredMana
    }

    const colors = 'wubrg'
    const uniqueColors = [...new Set(coloredMana.map(m => m.color))]

    if (uniqueColors.length === 1) {
      // All same color, maintain original relative order
      return coloredMana
    }

    // Special case: if all 5 colors are present, always start with W
    if (uniqueColors.length === 5) {
      const bestOrder = ['w', 'u', 'b', 'r', 'g']

      // Group mana by color and sort within groups
      const colorGroups = {}
      coloredMana.forEach(mana => {
        if (!colorGroups[mana.color]) {
          colorGroups[mana.color] = []
        }
        colorGroups[mana.color].push(mana)
      })

      // Sort within each color group to maintain stability
      Object.values(colorGroups).forEach(group => {
        group.sort((a, b) => manaArray.indexOf(a.symbol) - manaArray.indexOf(b.symbol))
      })

      // Combine in WUBRG order
      const result = []
      bestOrder.forEach(color => {
        if (colorGroups[color]) {
          result.push(...colorGroups[color])
        }
      })

      return result
    }

    // Find optimal starting color to minimize total distance
    let bestOrder = null
    let bestScore = Infinity // For tie-breaking

    // Try starting from each unique color
    for (const startColor of uniqueColors) {
      const order = [startColor]
      const remaining = uniqueColors.filter(c => c !== startColor)
      let totalDistance = 0
      let currentColor = startColor
      let wrapArounds = 0 // Count how many times we wrap around the circle

      // Greedily add nearest remaining colors
      while (remaining.length > 0) {
        let nearestColor = null
        let nearestDistance = Infinity

        for (const color of remaining) {
          const currentIndex = colors.indexOf(currentColor)
          const colorIndex = colors.indexOf(color)

          // Distance going clockwise around the circle
          const distance = (colorIndex - currentIndex + 5) % 5

          if (distance < nearestDistance ||
              (distance === nearestDistance &&
               colors.indexOf(color) < colors.indexOf(nearestColor))) {
            nearestDistance = distance
            nearestColor = color
          }
        }

        // Check if this step wraps around (goes from a later color to an earlier one)
        const currentIndex = colors.indexOf(currentColor)
        const nextIndex = colors.indexOf(nearestColor)
        if (nextIndex < currentIndex) {
          wrapArounds++
        }

        order.push(nearestColor)
        totalDistance += nearestDistance
        currentColor = nearestColor
        remaining.splice(remaining.indexOf(nearestColor), 1)
      }

      // Scoring: prefer lower distance, then fewer wrap-arounds, then starting with W
      const score = totalDistance * 100 + wrapArounds * 10 + (startColor === 'w' ? 0 : 1)

      if (score < bestScore) {
        bestScore = score
        bestOrder = order
      }
    }

    // Group mana by color and sort within groups
    const colorGroups = {}
    coloredMana.forEach(mana => {
      if (!colorGroups[mana.color]) {
        colorGroups[mana.color] = []
      }
      colorGroups[mana.color].push(mana)
    })

    // Sort within each color group to maintain stability
    Object.values(colorGroups).forEach(group => {
      group.sort((a, b) => manaArray.indexOf(a.symbol) - manaArray.indexOf(b.symbol))
    })

    // Combine in optimal order
    const result = []
    bestOrder.forEach(color => {
      result.push(...colorGroups[color])
    })

    return result
  }

  const optimizedColored = optimizeColorOrder(colored)

  // Combine all categories in order: variables, colorless, colored, unknown
  const result = [
    ...variables,
    ...colorless,
    ...optimizedColored,
    ...unknown
  ].map(m => m.symbol)

  return result
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

function parseCardListLine(line) {
  const [name, count] = parseCardLineCount(line)
  return { name, count }
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
