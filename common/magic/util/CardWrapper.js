const Wrapper = require('./Wrapper.js')
const CardFilter = require('./CardFilter.js')
const cardUtil = require('./cardUtil.js')
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

  static TYPELINE_DASH = '—'
  static TYPELINE_SPLITTER_REGEX = /[\u002d\u2013\u2014]/

  static blankFace() {
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

  static blankCard() {
    return {
      id: '',
      source: 'adhoc_token',

      data: {
        id: '',
        layout: 'normal',
        digital: false,
        rarity: 'common',
        legal: [],

        card_faces: [CardWrapper.blankFace()],
      }
    }
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
      return this.colorsInManaCost(faceIndex)
    }
  }
  colorsInManaCost(faceIndex) {
    const manaCost = this.manaCost(faceIndex).toLowerCase()
    return ['w', 'u', 'b', 'r', 'g'].filter(c => manaCost.includes(c))
  }
  colorsInOracleText(faceIndex) {
    const text = this.oracleText(faceIndex).toLowerCase()
    const symbols = cardUtil.extractSymbolsFromText(text).join('')
    return ['w', 'u', 'b', 'r', 'g'].filter(c => symbols.includes(c))
  }
  colorIdentity(faceIndex) {
    return util.array.distinct(
      [
        ...this.producedMana(faceIndex),
        ...this.colorIndicator(faceIndex),
        ...this.colorsInManaCost(faceIndex),
        ...this.colorsInOracleText(faceIndex),
      ].map(c => c.toLowerCase())
    ).sort()
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

  producedMana(faceIndex) {
    return this._getColorProp('produced_mana', faceIndex)
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
    const supertypesString = this
      .typeLine(faceIndex)
      .toLowerCase()
      .split(CardWrapper.TYPELINE_SPLITTER_REGEX)[0]
      .trim()
    return supertypesString ? supertypesString.split(/\s+/) : []
  }
  subtypes(faceIndex) {
    const subtypesString = this
      .typeLine(faceIndex)
      .toLowerCase()
      .split(CardWrapper.TYPELINE_SPLITTER_REGEX)[1]
      .trim()
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
    return this.manaValue()
  }
  manaValue() {
    if (this.layout() === 'split') {
      return cardUtil.manaCostFromCastingCost(this.manaCost())
    }
    else {
      return cardUtil.manaCostFromCastingCost(this.manaCost(0))
    }
  }
  manaCost(faceIndex) {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).mana_cost || ''
    }
    else {
      return this.faces().map(face => face.mana_cost || '').join(' // ')
    }
  }

  oracleText(faceIndex) {
    return this.oracleTextCardName(faceIndex).replaceAll('CARD_NAME', this.name(faceIndex))
  }

  oracleTextCardName(faceIndex) {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).oracle_text || ''
    }
    else {
      return this.faces().map(face => face.oracle_text || '').join('\n//\n')
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
    return this.supertypes(faceIndex).includes('artifact')
  }
  isCreature(faceIndex) {
    return this.supertypes(faceIndex).includes('creature')
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
  isPlaneswalker(faceIndex) {
    return this.supertypes(faceIndex).includes('planeswalker')
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

  ////////////////////////////////////////////////////////////////////////////////
  // Scars

  oldVersions(faceIndex, fieldName) {
    return this
      .changes
      .flatMap(x => x.changes)
      .filter(x => x.type === 'face_field' && x.faceIndex === faceIndex && x.field === fieldName)
      .map(x => x.oldValue)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Utility

  // Tests if the game-related attributes of two cards are the same.
  // Ignores attributes like artist, which don't affect game play.
  same(other) {
    const topEquals = (
      this.layout() === other.layout()
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
