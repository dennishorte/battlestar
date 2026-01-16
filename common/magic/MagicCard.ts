const { BaseCard } = require('../lib/game/index.js')
const { Serializer } = require('./util/Serializer.js')
const CardFilter = require('./util/CardFilter.js')
const cardUtil = require('./util/cardUtil.js')
const util = require('../lib/util.js')

import type { BaseCard as BaseCardType } from '../lib/game/index.js'
import type { Serializer as SerializerType, SerializerData } from './util/Serializer.js'
import type { CardFilterOptions } from './util/CardFilter.js'

interface MagicGame {
  mAdjustCardVisibility(card: MagicCard): void
  mMaybeClearAnnotations(card: MagicCard): void
  mMaybeClearCounters(card: MagicCard): void
  mMaybeRemoveTokens(card: MagicCard): void
  mUntap(card: MagicCard): void
  mTap(card: MagicCard): void
  mDetach(card: MagicCard): void
  log: {
    indent(): void
    outdent(): void
    add(entry: LogEntry): void
  }
  viewerName: string
  [key: string]: unknown
}

interface LogEntry {
  template: string
  args: Record<string, unknown>
  classes?: string[]
}

interface MagicZone {
  id: string
  name(): string
  owner(): { name: string } | null
  kind(): string
  cardlist(): MagicCard[]
  remove(card: MagicCard): void
  [key: string]: unknown
}

interface CardFaceData {
  artist: string
  defense: string
  flavor_text: string
  image_uri: string
  loyalty: string
  mana_cost: string
  name: string
  oracle_text: string
  power: string
  toughness: string
  type_line: string
  color_indicator: string[]
  produced_mana: string[]
  scarred?: boolean
  [key: string]: unknown
}

interface CardDataInner {
  id: string
  layout: string
  digital: boolean
  rarity: string
  legal: string[]
  set?: string
  collector_number?: string
  card_faces: CardFaceData[]
  [key: string]: unknown
}

interface CardData extends SerializerData {
  _id: string
  id: string
  source: string
  data: CardDataInner
  changes?: ChangeData[]
  [key: string]: unknown
}

interface ChangeData {
  changes: {
    type: string
    faceIndex: number
    field: string
    oldValue: unknown
  }[]
}

interface GameDataValues {
  id: string | null
  owner: string | null
  activeFaceIndex: number
  annotation: string
  annotationEOT: string
  attached: MagicCard[]
  attachedTo: MagicCard | null
  counters: Record<string, number>
  trackers: Record<string, unknown>
  morph: boolean
  secret: boolean
  noUntap: boolean
  tapped: boolean
  token: boolean
}

class GameData extends Serializer {
  constructor(parent: MagicCard) {
    const data: GameDataValues = {
      id: null,
      owner: null,
      activeFaceIndex: 0,

      annotation: '',
      annotationEOT: '',

      attached: [],
      attachedTo: null,

      counters: {
        '+1/+1': 0,
      },
      trackers: {},

      morph: false,
      secret: false,
      noUntap: false,
      tapped: false,
      token: false,
    }
    super(parent, data)
  }
}


class MagicCard extends BaseCard {
  sourceId: string
  serializer: SerializerType
  gameData: GameData
  game!: MagicGame
  zone!: MagicZone
  visibility!: { name: string }[]
  activeFace!: string

  // Inherited from BaseCard
  reveal!: () => void
  hide!: () => void
  show!: (player: unknown) => void
  visible!: (player: unknown) => boolean
  moveTo!: (zone: unknown, index?: number) => void

  // Injected by serializer
  _id!: string
  data!: CardDataInner
  source!: string
  changes?: ChangeData[]

  // Injected by gameData
  id!: string | null
  owner!: string | null | undefined
  activeFaceIndex!: number
  annotation!: string
  annotationEOT!: string
  attached!: MagicCard[]
  attachedTo!: MagicCard | null
  counters!: Record<string, number>
  trackers!: Record<string, unknown>
  morph!: boolean
  secret!: boolean
  noUntap!: boolean
  tapped!: boolean
  token!: boolean

  constructor(game: MagicGame, card: CardData) {
    super(game, card)

    this.sourceId = card._id

    // Serializer injects all the fields from card directly into this object.
    this.serializer = new Serializer(this, card)
    this.serializer.inject()

    this.gameData = new GameData(this)
    this.gameData.inject()
  }

  static TYPELINE_DASH = '—'
  static TYPELINE_SPLITTER_REGEX = /[\u002d\u2013\u2014]/

  static blankFace(): CardFaceData {
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

  static blankCard(): { id: string; source: string; data: CardDataInner } {
    return {
      id: '',
      source: 'adhoc_token',

      data: {
        id: '',
        layout: 'normal',
        digital: false,
        rarity: 'common',
        legal: [],

        card_faces: [MagicCard.blankFace()],
      }
    }
  }

  toJSON(): SerializerData {
    return this.serializer.serialize()
  }

  getId(): string {
    return this._id
  }

  _getColorProp(name: string, faceIndex?: number): string[] {
    if (typeof faceIndex === 'number') {
      return (this.face(faceIndex)[name] as string[]) || []
    }
    else {
      let colors: string[] = []
      for (const face of this.faces()) {
        colors = colors.concat((face[name] as string[]) || [])
      }
      return util.array.distinct(colors).sort()
    }
  }

  colors(faceIndex?: number): string[] {
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
  colorsInManaCost(faceIndex?: number): string[] {
    const manaCost = this.manaCost(faceIndex).toLowerCase()
    return ['w', 'u', 'b', 'r', 'g'].filter(c => manaCost.includes(c))
  }
  colorsInOracleText(faceIndex?: number): string[] {
    const text = this.oracleText(faceIndex).toLowerCase()
    const symbols = cardUtil.extractSymbolsFromText(text).join('')
    return ['w', 'u', 'b', 'r', 'g'].filter(c => symbols.includes(c))
  }
  colorIdentity(faceIndex?: number): string[] {
    return util.array.distinct(
      [
        ...this.producedMana(faceIndex),
        ...this.colorIndicator(faceIndex),
        ...this.colorsInManaCost(faceIndex),
        ...this.colorsInOracleText(faceIndex),
      ].map((c: string) => c.toLowerCase())
    ).sort()
  }
  colorIndicator(faceIndex?: number): string[] {
    return this._getColorProp('color_indicator', faceIndex)
  }
  colorKey(faceIndex?: number): string {
    return this.colors(faceIndex).map(c => c.toLowerCase()).sort().join('')
  }
  colorName(faceIndex?: number): string {
    return cardUtil.COLOR_KEY_TO_NAME[this.colorKey(faceIndex)]
  }

  producedMana(faceIndex?: number): string[] {
    return this._getColorProp('produced_mana', faceIndex)
  }

  typeLine(faceIndex?: number): string {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).type_line
    }
    else {
      return this.faces().map((face: CardFaceData) => face.type_line).join(' // ')
    }
  }
  supertypes(faceIndex?: number): string[] {
    const supertypesString = this
      .typeLine(faceIndex)
      .toLowerCase()
      .split(MagicCard.TYPELINE_SPLITTER_REGEX)[0]
      ?.trim()
    return supertypesString ? supertypesString.split(/\s+/) : []
  }
  subtypes(faceIndex?: number): string[] {
    const subtypesString = this
      .typeLine(faceIndex)
      .toLowerCase()
      .split(MagicCard.TYPELINE_SPLITTER_REGEX)[1]
      ?.trim()
    return subtypesString ? subtypesString.split(/\s+/) : []
  }

  name(faceIndex?: number): string {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).name
    }
    else {
      return this.faces().map((face: CardFaceData) => face.name).join(' // ')
    }
  }
  set(): string {
    return this.data.set || 'custom'
  }
  collectorNumber(): string | undefined {
    return this.data.collector_number
  }
  layout(): string {
    return this.data.layout
  }
  rarity(): string {
    return this.data.rarity
  }
  isDigital(): boolean {
    return this.data.digital
  }
  legalities(): string[] {
    return this.data.legal
  }

  cmc(): number {
    return this.manaValue()
  }
  manaValue(): number {
    if (this.layout() === 'split') {
      return cardUtil.manaCostFromCastingCost(this.manaCost())
    }
    else {
      return cardUtil.manaCostFromCastingCost(this.manaCost(0))
    }
  }
  manaCost(faceIndex?: number): string {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).mana_cost || ''
    }
    else {
      return this.faces().map((face: CardFaceData) => face.mana_cost || '').join(' // ')
    }
  }

  oracleText(faceIndex?: number): string {
    return this.oracleTextCardName(faceIndex).replaceAll('CARD_NAME', this.name(faceIndex))
  }

  oracleTextCardName(faceIndex?: number): string {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).oracle_text || ''
    }
    else {
      return this.faces().map((face: CardFaceData) => face.oracle_text || '').join('\n//\n')
    }
  }

  flavorText(faceIndex?: number): string {
    if (typeof faceIndex === 'number') {
      return this.face(faceIndex).flavor_text
    }
    else {
      return this.faces().map((face: CardFaceData) => face.flavor_text).join('\n//\n')
    }
  }

  power(faceIndex?: number): string | undefined {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).power
  }
  toughness(faceIndex?: number): string | undefined {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).toughness
  }
  powerToughness(faceIndex?: number): string | undefined {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return `${this.power(faceIndex)}/${this.toughness(faceIndex)}`
  }
  loyalty(faceIndex?: number): string | undefined {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).loyalty
  }
  defense(faceIndex?: number): string | undefined {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).defense
  }


  artist(faceIndex?: number): string | undefined {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).artist
  }
  imageUri(faceIndex?: number): string | undefined {
    if (typeof faceIndex !== 'number') {
      return undefined
    }
    return this.face(faceIndex).image_uri
  }

  hasColorIndicator(faceIndex?: number): boolean {
    return this.colorIndicator(faceIndex).length > 0
  }

  isArtifact(faceIndex?: number): boolean {
    return this.supertypes(faceIndex).includes('artifact')
  }
  isCreature(faceIndex?: number): boolean {
    return this.supertypes(faceIndex).includes('creature')
  }
  isColorless(faceIndex?: number): boolean {
    return this.colors(faceIndex).length === 0
  }
  isCubeCard(): boolean {
    return this.source === 'custom'
  }
  isLand(faceIndex?: number): boolean {
    return this.typeLine(faceIndex).toLowerCase().includes('land')
  }
  isMulticolor(faceIndex?: number): boolean {
    return this.colors(faceIndex).length > 1
  }
  isSiege(faceIndex?: number): boolean {
    return this.subtypes(faceIndex).includes('siege')
  }
  isPlaneswalker(faceIndex?: number): boolean {
    return this.supertypes(faceIndex).includes('planeswalker')
  }
  isVehicle(faceIndex?: number): boolean {
    return this.subtypes(faceIndex).includes('vehicle')
  }

  isLegalIn(format: string): boolean {
    return this.data.legal && this.data.legal.includes(format)
  }
  isScarred(faceIndex?: number): boolean {
    if (typeof faceIndex === 'number') {
      return Boolean(this.face(faceIndex).scarred)  // Often is undefined for scryfall cards
    }
    else {
      return this.faces().some((face: CardFaceData) => face.scarred)
    }
  }
  isVisible(player: { name: string }): boolean {
    return this.visibility.includes(player)
  }

  face(index: number): CardFaceData {
    if (!this.faces()) {
      throw new Error('stop 0')
    }

    if (!this.faces()[index]) {
      throw new Error('stop 1: ' + index)
    }
    return this.faces()[index]
  }
  faces(): CardFaceData[] {
    return this.data.card_faces
  }
  numFaces(): number {
    return this.faces().length
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Scars

  oldVersions(faceIndex: number, fieldName: string): unknown[] {
    if (!this.changes) {
      return []
    }

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
  same(other: MagicCard): boolean {
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

  matchesFilters(filters: CardFilterOptions[]): boolean {
    return filters.every(filterData => {
      const filter = new CardFilter(filterData)
      return filter.matches(this)
    })
  }

  clone(): MagicCard {
    return new MagicCard(this.game, this.toJSON() as CardData)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Card editing
  addFace(): void {
    this.faces().push(MagicCard.blankFace())
  }

  removeFace(index: number): void {
    this.faces().splice(index, 1)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Base Card Extensions

  _afterMoveTo(zone: MagicZone, _unused1: unknown, prevZone: MagicZone): void {
    this.game.mAdjustCardVisibility(this)
    this.game.mMaybeClearAnnotations(this)
    this.game.mMaybeClearCounters(this)
    this.game.mMaybeRemoveTokens(this)

    const sourceKind = prevZone.id.split('.').slice(-1)[0]
    const targetKind = zone.id.split('.').slice(-1)[0]

    // Card was moved to stack.
    if (targetKind === 'stack') {
      this.game.log.indent()
    }

    // Card was removed from stack.
    if (sourceKind === 'stack') {
      this.game.log.add({
        template: '{card} resolves',
        args: { card: this },
        classes: ['stack-pop'],
      })
      this.game.log.outdent()
    }

    // Card moved to a non-tap zone
    if (!['creatures', 'battlefield', 'land', 'attacking', 'blocking'].includes(targetKind)) {
      if (this.tapped) {
        this.game.mUntap(this)
      }

      if (this.attachedTo) {
        this.game.mDetach(this)
      }

      for (const attached of this.attached) {
        this.game.mDetach(attached)
      }
    }

    // Move card to the attacking zone, which usually taps them
    if (targetKind === 'attacking') {
      this.game.mTap(this)
    }
  }
}

module.exports = {
  MagicCard,
}

export { MagicCard, CardData, CardFaceData, CardDataInner, MagicGame, MagicZone }
