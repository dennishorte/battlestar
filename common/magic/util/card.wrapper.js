const Wrapper = require('./wrapper')
const cardUtil = require('../cardUtil')

class CardWrapper extends Wrapper {
  constructor(card) {
    super(card)
  }

  colors(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].colors : this.data.colors
  }
  colorIdentity(faceIndex) {
    return this.data.color_identity
  }
  colorKey(faceIndex) {
    return this.colors(faceIndex).map(c => c.toLowerCase()).sort().join('')
  }
  colorName(faceIndex) {
    return cardUtil.COLOR_KEY_TO_NAME[this.colorKey(faceIndex)]
  }

  typeLine(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].type_line : this.data.type_line
  }
  supertypes(faceIndex) {
    return this.typeLine(faceIndex).toLowerCase().split(' // ')[0].split(/\s+/)
  }
  subtypes(faceIndex) {
    const subtypesString = this.typeLine(faceIndex).toLowerCase().split(' // ')[1]
    return subtypesString ? subtypesString.split(/\s+/) : []
  }

  name(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].name : this.data.name
  }
  setCode() {
    return this.data.set
  }
  collectorNumber() {
    return this.data.collector_number
  }
  layout() {
    return this.data.layout
  }
  rarity() {
    return this.data.rarity
  }
  isDigital() {
    return this.data.digital
  }
  legalities() {
    return this.data.legal
  }

  cmc() {
    return this.data.cmc
  }
  manaCost(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].mana_cost : this.data.mana_cost
  }
  producedMana() {
    return this.data.produced_mana
  }

  oracleText(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].oracle_text : this.data.oracle_text
  }
  flavorText(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].flavor_text : this.data.flavor_text
  }

  power(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].power : this.data.power
  }
  toughness(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].toughness : this.data.toughness
  }
  loyalty(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].loyalty : this.data.loyalty
  }
  defense(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].defense : this.data.defense
  }


  artist(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].artist : this.data.artist
  }
  imageUri(faceIndex) {
    return faceIndex ? this.data.card_faces[faceIndex].image_uri : this.data.image_uri
  }


  isArtifact(faceIndex) {
    return this.typeLine(faceIndex).toLowerCase().includes('artifact')
  }
  isColorless(faceIndex) {
    return this.colorIdentity(faceIndex).length === 0
  }
  isLand(faceIndex) {
    return this.typeLine(faceIndex).toLowerCase().includes('land')
  }
  isMulticolor(faceIndex) {
    return this.colorIdentity(faceIndex).length > 1
  }
  isSiege(faceIndex) {
    return this.subtypes(faceIndex).includes('siege')
  }

  isLegalIn(format) {
    return this.data.legal && this.data.legal.includes(format)
  }
  isScarred() {
    return false
  }

  numFaces() {
    return this.data.card_faces.length
  }

  matchesFilters(filters) {
    return filters.every(filter => _applyOneFilter(this, filter))
  }
}

module.exports = CardWrapper

////////////////////////////////////////////////////////////////////////////////
// Filter Logic

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

function _applyOneFilter(card, filter) {
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
