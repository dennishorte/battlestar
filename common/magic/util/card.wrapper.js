const Wrapper = require('./wrapper.js')
const cardUtil = require('../cardUtil.js')
const util = require('../../lib/util.js')

class GameData {
  constructor() {
    this.id = null
    this.owner = null
    this.activeFaceIndex = 0

    this.annotation = ''
    this.annotationEOT = ''

    this.attached = []
    this.attachedTo = null

    this.counters = {
      '+1/+1': 0,
    }
    this.trackers = {}

    this.morph = false
    this.secret = false
    this.noUntap = false
    this.tapped = false
    this.token = false
  }
}

const TYPELINE_SPLITTER_REGEX = /\s*[—-—–]\s*/

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

  _getColorProp(name, faceIndex) {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex)[name] || []
    }
    else {
      let colors = []
      for (const face of this.faces()) {
        colors = colors.concat(face[name] || [])
      }
      return util.array.distinct(colors).sort()
    }
  }

  colors(faceIndex) {
    if (/\bdevoid\b/i.test(this.oracleText(faceIndex).toLowerCase())) {
      return []
    }
    else if (this.colorIndicator(faceIndex).length > 0) {
      return this.colorIndicator(faceIndex)
    }
    else {
      return this.colorsInCastingCost(faceIndex)
    }
  }
  colorsInCastingCost(faceIndex) {
    return ['w', 'u', 'b', 'r', 'g'].filter(c => this.manaCost(faceIndex).toLowerCase().includes(c))
  }
  colorIdentity(faceIndex) {
    return util.array.distinct([
      ...this.colorsInCastingCost(faceIndex),
      ...this.manaProduced(faceIndex),
      ...this.colorIndicator(faceIndex),
    ]).sort()
  }
  colorIndicator(faceIndex) {
    return this._getColorProp('color_indicator', faceIndex)
  }
  colorKey(faceIndex) {
    return this.colors(faceIndex).map(c => c.toLowerCase()).sort().join('')
  }
  colorName(faceIndex) {
    return cardUtil.COLOR_KEY_TO_NAME[this.colorKey(faceIndex)]
  }

  manaProduced(faceIndex) {
    return this._getColorProp('mana_produced', faceIndex)
  }

  typeLine(faceIndex) {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).type_line
    }
    else {
      return this.faces().map(face => face.type_line).join(' // ')
    }
  }
  supertypes(faceIndex) {
    const supertypesString = this.typeLine(faceIndex).toLowerCase().split(TYPELINE_SPLITTER_REGEX)[0]
    return supertypesString ? supertypesString.split(/\s+/) : []
  }
  subtypes(faceIndex) {
    const subtypesString = this.typeLine(faceIndex).toLowerCase().split(TYPELINE_SPLITTER_REGEX)[1]
    return subtypesString ? subtypesString.split(/\s+/) : []
  }

  name(faceIndex) {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).name
    }
    else {
      return this.faces().map(face => face.name).join(' // ')
    }
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
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).mana_cost || ''
    }
    else {
      return this.faces().map(face => face.mana_cost || '').join(' // ')
    }
  }
  producedMana(faceIndex) {
    return this._getColorProp('produced_mana', faceIndex)
  }

  oracleText(faceIndex) {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).oracle_text
    }
    else {
      return this.faces().map(face => face.oracle_text).join('\n//\n')
    }
  }
  flavorText(faceIndex) {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).flavor_text
    }
    else {
      return this.faces().map(face => face.flavor_text).join('\n//\n')
    }
  }

  power(faceIndex) {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).power
  }
  toughness(faceIndex) {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).toughness
  }
  powerToughness(faceIndex) {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return `${this.power(faceIndex)}/${this.toughness(faceIndex)}`
  }
  loyalty(faceIndex) {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).loyalty
  }
  defense(faceIndex) {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).defense
  }


  artist(faceIndex) {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).artist
  }
  imageUri(faceIndex) {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).image_uri
  }

  hasColorIndicator(faceIndex) {
    return this.colorIndicator(faceIndex).length > 0
  }

  isArtifact(faceIndex) {
    return this.typeLine(faceIndex).toLowerCase().includes('artifact')
  }
  isColorless() {
    return this.colors().length === 0
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
  isScarred(faceIndex) {
    if (typeof faceIndex === 'number') {
      return Boolean(this.face(faceIndex).scarred)  // Often is undefined for scryfall cards
    }
    else {
      return this.faces().some(face => face.scarred)
    }
  }
  isVisible(player) {
    return this.visibility.includes(player)
  }

  face(index) {
    if (!this.faces()) {
      throw new Error('stop 0')
    }

    if (!this.faces()[index]) {
      throw new Error('stop 1', index)
    }
    return this.faces()[index]
  }
  faces() {
    return this.data.card_faces
  }
  numFaces() {
    return this.faces().length
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
    return filters.every(filterData => {
      const filter = new CardFilter(filterData)
      return filter.matches(this)
    })
  }

  clone() {
    return new CardWrapper(this.toJSON())
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Card editing
  addFace() {
    this.faces().push(cardUtil.blankFace())
  }

  removeFace(index) {
    this.faces().splice(index, 1)
  }
}

module.exports = CardWrapper

////////////////////////////////////////////////////////////////////////////////
// Filter Logic


class CardFilter {
  constructor(opts) {
    this.kind = opts.kind
    this.value = opts.value
    this.operator = opts.operator || null
    this.or = opts.or || false
    this.only = opts.only || false

    this.red = opts.red || null
    this.green = opts.green || null
    this.black = opts.black || null
    this.white = opts.white || null
    this.blue = opts.blue || null
  }

  matches(card) {
    if (this.kind === 'legality') {
      return card.isLegalIn(this.value)
    }
    else if (this.kind === 'colors' || this.kind === 'identity') {
      const fieldValue = this.kind === 'colors' ? card.colors() : card.colorIdentity()
      const targetValueMatches = ['white', 'blue', 'black', 'red', 'green']
        .map(color => this[color] ? colorNameToSymbol[color] : undefined)
        .filter(symbol => symbol !== undefined)
        .map(symbol => fieldValue.includes(symbol))

      if (this.or) {
        if (this.only) {
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
        if (this.only) {
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
      const fieldKey = fieldMapping[this.kind]
      const fieldValues = []

      if (card[fieldKey]()) {
        fieldValues.push(card[fieldKey]())
      }
      else {
        for (let i = 0; i < card.numFaces(); i++) {
          fieldValues.push(card[fieldKey](i))
        }
      }

      if (textFields.includes(this.kind)) {
        const lowerValues = fieldValues.map(x => x.toLowerCase())

        if (this.operator === 'or') {
          const targetValues = this.value.map(v => v.toLowerCase())
          return targetValues.some(v => lowerValues.includes(v))
        }

        else {
          const fieldValue = lowerValues.join(' ')
          const targetValue = this.value

          if (this.operator === 'and') {
            return fieldValue.includes(targetValue)
          }
          else if (this.operator === 'not') {
            return !fieldValue.includes(targetValue)
          }
          else {
            throw new Error(`Unhandled string operator: ${this.operator}`)
          }
        }
      }
      else if (numberFields.includes(this.kind)) {
        const targetValue = parseFloat(this.value)
        const floatValues = fieldValues.map(val => parseFloat(val))

        return floatValues.some(fieldValue => {
          if (fieldValue === -999) {
            return false
          }
          else if (this.operator === '=') {
            return fieldValue === targetValue
          }
          else if (this.operator === '>=') {
            return fieldValue >= targetValue
          }
          else if (this.operator === '<=') {
            return fieldValue <= targetValue
          }
          else {
            throw new Error(`Unhandled numeric operator: ${this.operator}`)
          }
        })
      }
      else {
        throw new Error(`Unhandled filter field: ${this.kind}`)
      }
    }
  }
}

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
