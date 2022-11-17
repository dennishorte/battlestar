import { util } from 'battlestar-common'


const CardUtil = {}

CardUtil.sortTypes = [
  'land',
  'creature',
  'planeswalker',
  'enchantment',
  'artifact',
  'instant',
  'sorcery',
]

CardUtil.allCardNames = function(card) {
  const names = [card.name.toLowerCase()]

  if (card.card_faces) {
    for (const face of card.card_faces) {
      names.push(face.name.toLowerCase())
    }
  }

  return names
}

CardUtil.blankFace = function() {
  return {
    artist: '',
    card_faces: '',
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
    color_indicator: [],
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

    cmc: '0',
    color_identity: [],
    colors: [],
    produced_mana: [],
  }
}

CardUtil.equals = function(a, b) {
  const aName = a.name.split(' // ')[0].toLowerCase()
  const bName = b.name.split(' // ')[0].toLowerCase()

  return aName === bName
}

CardUtil.getSortType = function(card) {
  if (card) {
    const typeline = (card.type_line || '').toLowerCase()

    for (const sortType of this.sortTypes) {
      if (typeline.includes(sortType)) {
        return sortType
      }
    }
  }

  return 'other'
}

CardUtil.isLand = function(card) {
  return card.type_line.toLowerCase().includes('land')
}

CardUtil.isArtifact = function(card) {
  return card.type_line.toLowerCase().includes('artifact')
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

    if (ch === '{') {
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

    else if (ch === '(') {
      if (part.type === 'reminder') {
        throw new Error('text parse error: already in a reminder')
      }
      close()
      part.type = 'reminder'
    }

    else if (ch === ')') {
      if (part.type !== 'reminder') {
        throw new Error('text parse error: unmatched close paren')
      }
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
    switch (card.colors[0]) {
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
        text = util.string_reverse(text)
      }

      return text
    }
  }
}

CardUtil.manaSymbolsFromString = function(string) {
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

CardUtil.parseCardlist = function(cardlist) {
  const cards = {
    main: [],
    side: [],
    command: [],
  }

  let zone = cards.main

  for (let line of cardlist.toLowerCase().split('\n')) {
    line = line.trim()

    if (line.endsWith(':')) {
      line = line.slice(0, line.length - 1)
    }

    if (line.length === 0) {
      continue
    }
    else if (line === 'deck' || line === 'main' || line === 'maincard') {
      zone = cards.main
    }
    else if (line === 'side' || line === 'sideboard') {
      zone = cards.side
    }
    else if (line === 'command' || line === 'commander') {
      zone = cards.command
    }
    else {
      zone.push(parseCardListLine(line))
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

export default CardUtil
