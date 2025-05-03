const Wrapper = require('./wrapper')
const cardUtil = require('../cardUtil')

class GameData {
  constructor() {
    this.id = null
    this.owner = null
    this.activeFace = null

    this.annotation = ''
    this.annotationEOT = ''

    this.attached = []
    this.attachedTo = null

    this.counters= {
      '+1/+1': 0,
    }

    this.morph = false
    this.noUntap = false
    this.tapped = false
    this.token = false
  }
}

class CardWrapper extends Wrapper {
  constructor(card) {
    super(card)
    this.g = new GameData()

    // Sadly, these three values are used by the base class of magic.js, game.js. Changing them would
    // Cause problems with other games, so they will remain on the root.
    this.zone = null
    this.home = null
    this.visibility = []
  }

  id() {
    return this._id
  }

  colors(faceIndex) {
    return faceIndex !== undefined ? this.face(faceIndex).colors : this.data.colors
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
    return faceIndex !== undefined ? this.face(faceIndex).type_line : this.data.type_line
  }
  supertypes(faceIndex) {
    return this.typeLine(faceIndex).toLowerCase().split(' // ')[0].split(/\s+/)
  }
  subtypes(faceIndex) {
    const subtypesString = this.typeLine(faceIndex).toLowerCase().split(' // ')[1]
    return subtypesString ? subtypesString.split(/\s+/) : []
  }

  name(faceIndex) {
    return faceIndex !== undefined ? this.face(faceIndex).name : this.data.name
  }
  set() {
    return this.data.set || 'custom'
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
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).mana_cost
  }
  producedMana() {
    return this.data.produced_mana
  }

  oracleText(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).oracle_text
  }
  flavorText(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).flavor_text
  }

  power(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).power
  }
  toughness(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).toughness
  }
  powerToughness(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return `${this.power(faceIndex)}/${this.toughness(faceIndex)}`
  }
  loyalty(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).loyalty
  }
  defense(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).defense
  }


  artist(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).artist
  }
  imageUri(faceIndex) {
    if (faceIndex === undefined) {
      return undefined
    }
    return this.face(faceIndex).image_uri
  }


  isArtifact(faceIndex) {
    return this.typeLine(faceIndex).toLowerCase().includes('artifact')
  }
  isColorless(faceIndex) {
    return this.colors(faceIndex).length === 0
  }
  isCubeCard() {
    return this.source === 'custom'
  }
  isLand(faceIndex) {
    return this.typeLine(faceIndex).toLowerCase().includes('land')
  }
  isMulticolor(faceIndex) {
    return this.colors(faceIndex).length > 1
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

  face(index) {
    if (!this.data.card_faces) {
      throw new Error('stop 0')
    }

    if (!this.data.card_faces[index]) {
      throw new Error('stop 1', index)
    }
    return this.data.card_faces[index]
  }
  numFaces() {
    return this.data.card_faces.length
  }

  same(other) {
    const topEquals = (
      this.name() === other.name()
      && this.layout() === other.layout()
      && this.typeLine() === other.typeLine()
      && this.cmc() === other.cmc()
      && this.numFaces() === other.numFaces()
    )
    if (!topEquals) {
      return false
    }

    for (let i = 0; i < this.numFaces(); i++) {
      const faceEquals = (
        this.name(i) === other.name(i)
        && this.oracleText(i) === other.oracleText(i)
        && this.typeLine(i) === other.typeLine(i)
        && this.manaCost(i) === other.manaCost(i)
        && this.defense(i) === other.defense(i)
        && this.loyalty(i) === other.loyalty(i)
        && this.power(i) === other.power(i)
        && this.toughness(i) === other.toughness(i)
      )

      if (!faceEquals) {
        return false
      }
    }

    return true
  }

  matchesFilters(filters) {
    return filters.every(filter => _applyOneFilter(this, filter))
  }

  clone() {
    return new CardWrapper(this.toJSON())
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
  flavor: 'flavorText',
  identity: 'colorIdentity',
  loyalty: 'loyalty',
  name: 'name',
  power: 'power',
  set: 'set',
  text: 'oracleRext',
  toughness: 'toughness',
  type: 'typeLine',
}
const colorNameToSymbol = {
  white: 'W',
  blue: 'U',
  black: 'B',
  red: 'R',
  green: 'G',
}

function _applyOneFilter(card, filter) {
  if (filter.kind === 'legality') {
    return card.isLegalIn(filter.value)
  }
  else if (filter.kind === 'colors' || filter.kind === 'identity') {
    const fieldKey = fieldMapping[filter.kind]
    const fieldValue = filter.kind === 'colors' ? card.colors() : card.colorIdentity()
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
  else {
    const fieldKey = fieldMapping[filter.kind]
    const fieldValues = []

    if (card[fieldKey]()) {
      fieldValues.push(card[fieldKey]())
    }
    else {
      for (let i = 0; i < card.numFaces(); i++) {
        fieldValues.push(card[fieldKey](i))
      }
    }

    if (textFields.includes(filter.kind)) {
      const lowerValues = fieldValues.map(x => x.toLowerCase())

      if (filter.operator === 'or') {
        const targetValues = filter.value.map(v => v.toLowerCase())
        return targetValues.some(v => lowerValues.includes(v))
      }

      else {
        const fieldValue = lowerValues.join(' ')
        const targetValue = filter.value

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
      const targetValue = parseFloat(filter.value)
      const floatValues = fieldValues.map(val => parseFloat(val))

      return floatValues.some(fieldValue => {
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
  }

  return false
}
