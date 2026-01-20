import {
  Game,
  GameFactory,
  GameOverEvent,
  SerializedGame,
  GameState,
  GameSettings,
  SelectorInput,
  PlayerData,
  GameOverData,
} from '../lib/game.js'
import {
  BasePlayerManager,
  BaseLogManager,
  BaseCardManager,
  BasePlayerInterface,
  BaseZoneInterface,
} from '../lib/game/index.js'

import * as res from './data.js'
import util from '../lib/util.js'

import * as CubeWrapperModule from './util/CubeWrapper.js'
import * as DeckWrapperModule from './util/DeckWrapper.js'

const wrappers = {
  cube: CubeWrapperModule,
  deck: DeckWrapperModule,
}

import { MagicCard } from './MagicCard.js'
import { MagicCardManager } from './MagicCardManager.js'
import { MagicLogManager } from './MagicLogManager.js'
import { MagicPlayerManager } from './MagicPlayerManager.js'
import { MagicZone } from './MagicZone.js'

import * as cubeDraft from './draft/cube_draft.js'
import * as pack from './draft/pack.js'
import * as cardUtilModule from './util/cardUtil.js'

import type { MagicCard as MagicCardType, CardData } from './MagicCard.js'
import type { DeckWrapper } from './util/DeckWrapper.js'

interface Player extends BasePlayerInterface {
  counters: Record<string, number>
  addCounter(name: string, value: number): void
  incrementCounter(name: string, amount: number): void
  [key: string]: unknown
}

interface Zone extends BaseZoneInterface {
  cardlist(): MagicCardType[]
  push(card: MagicCardType): void
  shuffle(): void
  shuffleBottom(count: number): void
  sortByName(): void
  kind(): string
  owner(): Player | null
  name: string
  remove(card: MagicCardType): void
  initializeCards(cards: MagicCardType[]): void
}

interface MagicState extends GameState {
  nextLocalId: number
  turnPlayer: Player | null
  initializationComplete?: boolean
  decksSelected?: boolean
  phase: string
}

interface InputRequest {
  actor: string
  title: string
  choices: string
  [key: string]: unknown
}

interface InputResponse {
  actor: string
  noUndo?: boolean
  deckData?: DeckData
  [key: string]: unknown
}

interface DeckData {
  data: unknown
  cards: {
    main: CardData[]
    side: CardData[]
    command: CardData[]
  }
}

interface ActionData {
  name: string
  playerName?: string
  cardId?: string
  faceIndex?: number
  key?: string
  count?: number
  counter?: string
  amount?: number
  annotation?: string
  targetId?: string
  x?: number
  data?: TokenData | ImportData
  zoneId?: string
  sourceId?: string
  targetName?: string
  phase?: string
  faces?: number
  destId?: string
  destIndex?: number
  [key: string]: unknown
}

interface TokenData {
  zoneId: string
  count: number
  name: string
  annotation?: string
  morph?: boolean
}

interface ImportData {
  count: number
  card: CardData
  annotation: string
  isToken: boolean
  zoneId: string
}

interface LogEntry {
  template: string
  args?: Record<string, unknown>
  classes?: string[]
}

interface LobbyData {
  name: string
  seed: string
  users: unknown[]
  options: {
    format: string
    linkedDraftId?: string
  }
}

interface MagicSettings extends GameSettings {
  format?: string
  linkedDraftId?: string
}

interface SerializedMagic extends SerializedGame {
  waiting?: unknown
  gameOver?: boolean
  gameOverData?: unknown
}

class Magic extends Game<MagicState, MagicSettings, GameOverData, MagicCardType, Zone, Player> {
  // Redeclare managers with specific types for access to game-specific methods
  declare cards: MagicCardManager
  declare players: MagicPlayerManager
  declare log: MagicLogManager

  cardWrapper: typeof MagicCard

  constructor(serialized_data: SerializedGame, viewerName?: string) {
    super(serialized_data, viewerName, {
      LogManager: MagicLogManager as unknown as typeof BaseLogManager,
      CardManager: MagicCardManager as unknown as typeof BaseCardManager,
      PlayerManager: MagicPlayerManager as unknown as typeof BasePlayerManager,
    })

    this.cardWrapper = MagicCard
  }

  serialize(): SerializedMagic {
    const base = super.serialize() as unknown as SerializedMagic

    // Include these because Magic doesn't run on the backend when saving,
    // so can't calculate these values.
    base.waiting = this.waiting
    base.gameOver = this.gameOver
    base.gameOverData = this.gameOverData

    return base
  }

  setCardWrapper(wrapper: typeof MagicCard): void {
    this.cardWrapper = wrapper
  }

  _mainProgram(): void {
    this.initialize()
    this.chooseDecks()

    this.state.phase = 'start turn'
    this.log.setIndent(0)
    this.log.add({
      template: "{player}'s turn",
      args: {
        player: this.players.current(),
        classes: ['start-turn'],
      }
    })
    this.log.indent()
    this.log.add({
      template: '{player} gets priority',
      args: { player: this.players.current() },
      classes: ['pass-priority'],
    })

    this.mainLoop()
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Initialization

  initialize(): void {
    this.log.add({ template: 'Initializing' })
    this.log.indent()

    this.state.nextLocalId = 1
    this.state.turnPlayer = null

    this.initializePlayers()
    this.initializeZones()

    this.log.outdent()
    this.state.initializationComplete = true
    this._breakpoint('initialization-complete')
  }

  initializePlayers(): void {
    this.players.all().forEach(player => {
      player.addCounter('life', 20)
    })
  }

  initializeZones(): void {
    const zones: [string, string][] = [
      ['hand', 'private'],
      ['library', 'hidden'],
      ['sideboard', 'private'],
      ['battlefield', 'public'],
      ['command', 'public'],
      ['creatures', 'public'],
      ['graveyard', 'public'],
      ['exile', 'public'],
      ['land', 'public'],
      ['stack', 'public'],
      ['attacking', 'public'],
      ['blocking', 'public'],
    ]

    for (const player of this.players.all()) {
      for (const [name, kind] of zones) {
        const id = `players.${player.name}.${name}`
        const zone = new MagicZone(this, id, name, kind, player)
        this.zones.register(zone)
      }
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Game Phases

  chooseDecks(): void {
    this.log.add({ template: 'Choosing starting decks' })
    this.log.indent()

    const requests = this
      .players.all()
      .map(player => ({
        actor: this.utilSerializeObject(player),
        title: 'Choose Deck',
        choices: '__UNSPECIFIED__',
      }))

    const responses = this.requestInputMany(requests)

    // Once both players have selected their decks, they can't go back.
    responses.forEach(r => r.noUndo = true)

    for (const response of responses) {
      const player = this.players.byName(response.actor)
      this.setDeck(player, response.deckData!)
    }

    this.state.decksSelected = true

    this._breakpoint('decks-selected')
    this.log.outdent()
  }

  mainLoop(): void {
    while (true) {
      this.aChooseAction(this.players.current())
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Setters, getters, actions, etc.

  aActiveFace(player: Player | null, cardId: string, faceIndex: number): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)
    const prevFaceIndex = card.activeFaceIndex
    card.activeFaceIndex = faceIndex

    const prevFaceName = card.name(prevFaceIndex)
    const activeFaceName = card.name(card.activeFaceIndex)

    this.log.add({
      template: `{player} flips ${prevFaceName} to ${activeFaceName}`,
      args: { player },
    })
  }

  aAddCounter(player: Player | null, cardId: string, name: string, opts: { noIncrement?: boolean } = {}): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)

    if (!card.counters[name]) {
      card.counters[name] = 0

      if (!opts.noIncrement) {
        this.aAdjustCardCounter(player, cardId, name, 1)
      }
    }
  }

  aAddTracker(player: Player | null, cardId: string, name: string, opts: { noIncrement?: boolean } = {}): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)

    if (!card.trackers[name]) {
      card.trackers[name] = 0

      if (!opts.noIncrement) {
        this.aAdjustCardTracker(player, cardId, name, 1)
      }
    }
  }

  aAddCounterPlayer(player: Player, targetName: string, counterName: string): void {
    const target = this.players.byName(targetName)

    if (counterName in target.counters) {
      throw new Error(`Counter already exists: ${counterName}`)
    }

    target.counters[counterName] = 0

    this.log.add({
      template: 'Counter {name} added to {player}',
      args: { player: target, name: counterName },
    })
  }

  aAdjustCardCounter(player: Player | null, cardId: string, name: string, amount: number): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)
    card.counters[name] += amount

    let msg
    if (amount === 1) {
      msg = 'added'
    }
    else if (amount === -1) {
      msg = 'removed'
    }
    else {
      msg = `adjusted by ${amount}`
    }

    this.log.add({
      template: `{card} ${name} counter ${msg}`,
      args: { card }
    })
  }

  aAdjustCardTracker(player: Player | null, cardId: string, name: string, amount: number): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)
    card.trackers[name] = (card.trackers[name] as number) + amount

    let msg
    if (amount === 1) {
      msg = 'added'
    }
    else if (amount === -1) {
      msg = 'removed'
    }
    else {
      msg = `adjusted by ${amount}`
    }

    this.log.add({
      template: `{card} ${name} tracker ${msg}`,
      args: { card }
    })
  }

  aAnnotate(player: Player | null, cardId: string, annotation: string): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)
    card.annotation = annotation
    this.log.add({
      template: '{player} sets annotation on {card} to {annotation}',
      args: { player, card, annotation },
    })
  }

  aAnnotateEOT(player: Player | null, cardId: string, annotation: string): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)
    card.annotationEOT = annotation
    this.log.add({
      template: '{player} sets EOT annotation on {card} to {annotation}',
      args: { player, card, annotation },
    })
  }

  aAttach(player: Player, cardId: string, targetId: string): void {
    const source = this.cards.byId(cardId)
    const target = this.cards.byId(targetId)

    if (source.attachedTo) {
      this.mDetach(source)
    }
    this.mAttach(target, source)
  }

  aCascade(player: Player, x: number): void {
    const cards = this.cards.byPlayer(player, 'library')

    this.log.add({
      template: '{player} cascades for {count}',
      args: { player, count: x },
    })
    this.log.indent()

    this.log.add({ template: 'revealing cards' })
    this.log.indent()

    let i
    for (i = 0; i < cards.length; i++) {
      this.aReveal(player, cards[i])

      if (cards[i].cmc() < x && !cards[i].isLand()) {
        break
      }
    }

    this.log.outdent()

    if (i < cards.length) {
      const card = cards[i]
      this.log.add({
        template: '{player} cascades into {card}',
        args: { player, card }
      })
      this.log.indent()

      card.moveTo(this.zones.byPlayer(player, 'stack'))
      const library = this.zones.byPlayer(player, 'library')
      for (let j = 0; j < i; j++) {
        cards[j].moveTo(library)
      }
      this.log.add({
        template: '{player} moves {count} cards to the bottom of their library',
        args: { player, count: i }
      })
      library.shuffleBottom(i)

      this.log.outdent()
    }

    else {
      this.log.add({
        template: '{player} fails to find a valid cascade target',
        args: { player }
      })
    }

    this.log.outdent()
  }

  aConcede(player: Player): void {
    this.log.add({
      template: '{player} concedes',
      args: { player },
      classes: ['player-concedes']
    })
    player.eliminated = true

    // If only one team remains, then the game is over.
    const teams = util.array.collect(this.players.all(), (p: Player) => p.team) as Record<string, Player[]>
    const remaining = Object.values(teams).filter(players => players.some(p => !p.eliminated))

    if (remaining.length === 1) {
      const winningTeam = remaining[0]
      if (winningTeam.length === 1) {
        throw new GameOverEvent({
          player: winningTeam[0].name,
          reason: 'I am the best, you are the rest!',
        })
      }
      else {
        throw new GameOverEvent({
          player: `team ${winningTeam[0].team}`,
          reason: 'All your base are belong to us.',
        })
      }
    }
  }

  aChooseAction(player: Player): void {
    const actions = this.requestInputSingle({
      actor: player.name,
      title: 'Do Something',
      choices: '__UNSPECIFIED__',
    })

    for (const action of actions as ActionData[]) {
      const actor = action.playerName ? this.players.byName(action.playerName) : player

      switch (action.name) {
        case 'active face'         : return this.aActiveFace(actor, action.cardId!, action.faceIndex!)
        case 'add counter'         : return this.aAddCounter(actor, action.cardId!, action.key!)
        case 'add counter player'  : return this.aAddCounterPlayer(actor, action.playerName!, action.key!)
        case 'add tracker'         : return this.aAddTracker(actor, action.cardId!, action.key!)
        case 'adjust c-counter'    : return this.aAdjustCardCounter(actor, action.cardId!, action.key!, action.count!)
        case 'adjust c-tracker'    : return this.aAdjustCardTracker(actor, action.cardId!, action.key!, action.count!)
        case 'adjust counter'      : return actor.incrementCounter(action.counter!, action.amount!)
        case 'annotate'            : return this.aAnnotate(actor, action.cardId!, action.annotation!)
        case 'annotate eot'        : return this.aAnnotateEOT(actor, action.cardId!, action.annotation!)
        case 'attach'              : return this.aAttach(actor, action.cardId!, action.targetId!)
        case 'cascade'             : return this.aCascade(actor, action.x!)
        case 'create token'        : this.aCreateToken(actor, action.data as TokenData); return
        case 'concede'             : return this.aConcede(actor)
        case 'detach'              : return this.aDetach(actor, action.cardId!)
        case 'draw'                : return this.aDraw(actor)
        case 'draw 7'              : return this.aDrawSeven(actor)
        case 'draw game'           : return this.aDrawGame(actor)
        case 'hide all'            : return this.aHideAll(actor, action.zoneId!)
        case 'import card'         : return this.aImportCard(actor, action.data as ImportData)
        case 'morph'               : return this.aMorph(actor, action.cardId!)
        case 'move all'            : return this.aMoveAll(actor, action.sourceId!, action.targetId!)
        case 'move card'           : return this.aMoveCard(actor, action.cardId!, action.destId!, action.destIndex)
        case 'move revealed'       : return this.aMoveRevealed(actor, action.sourceId!, action.targetId!)
        case 'mulligan'            : return this.aMulligan(actor)
        case 'notap clear'         : return this.aSetNoUntap(actor, action.cardId!, false)
        case 'notap set'           : return this.aSetNoUntap(actor, action.cardId!, true)
        case 'pass priority'       : return this.aPassPriority(actor, action.targetName)
        case 'reveal'              : return this.aReveal(actor, action.cardId!)
        case 'reveal all'          : return this.aRevealAll(actor, action.zoneId!)
        case 'reveal next'         : return this.aRevealNext(actor, action.zoneId!)
        case 'roll die'            : return this.actions.rollDie(actor, action.faces!)
        case 'secret'              : return this.aSecret(actor, action.cardId!)
        case 'select phase'        : return this.aSelectPhase(actor, action.phase!)
        case 'shuffle'             : return this.aShuffle(actor, action.zoneId!)
        case 'shuffle bottom'      : return this.aShuffleBottom(actor, action.zoneId!, action.count!)
        case 'stack effect'        : return this.aStackEffect(actor, action.cardId!)
        case 'tap'                 : return this.aTap(actor, action.cardId!)
        case 'tap all'             : return this.aTapAll(actor, action.zoneId!)
        case 'unmorph'             : return this.aUnmorph(actor, action.cardId!)
        case 'unsecret'            : return this.aUnsecret(actor, action.cardId!)
        case 'untap'               : return this.aUntap(actor, action.cardId!)
        case 'view all'            : return this.aViewAll(actor, action.zoneId!)
        case 'view next'           : return this.aViewNext(actor, action.zoneId!)
        case 'view top k'          : return this.aViewTop(actor, action.zoneId!, action.count!)

        default:
          throw new Error(`Unknown action: ${action.name}`)
      }
    }
  }

  aCreateToken(player: Player, data: TokenData, opts: { silent?: boolean } = {}): MagicCardType[] {
    const zone = this.zones.byId(data.zoneId)
    const owner = this.players.byZone(zone)

    const created: MagicCardType[] = []

    for (let i = 0; i < data.count; i++) {
      // Create fake card data
      const cardData = MagicCard.blankCard()
      cardData.data.name = data.name
      cardData.data.type_line = 'Token'

      cardData.data.card_faces[0].type_line = 'Token'
      cardData.data.card_faces[0].name = data.name
      cardData.data.card_faces[0].image_uri = 'https://i.pinimg.com/736x/6e/fe/d4/6efed4b65fb7666de4b615d8b1195258.jpg'

      // Insert card into game
      const card = this.mInitializeCard(cardData, owner)
      card.annotation = data.annotation || ''
      card.token = true

      if (data.morph) {
        card.morph = true
        card.hide()
        card.show(player)
      }
      else {
        card.reveal()
      }

      zone.push(card)
      created.push(card)

      if (zone.id.endsWith('.stack')) {
        this.log.addStackPush(player, card)
        this.log.indent()
      }
      else if (!opts.silent) {
        this.log.add({
          template: "{card} imported to {zone}",
          args: { player: owner, card, zone },
        })
      }
    }

    return created
  }

  aDetach(player: Player, cardId: string): void {
    const card = this.cards.byId(cardId)
    this.mDetach(card)
  }

  aDraw(player?: Player, opts: { silent?: boolean } = {}): void {
    player = player || this.players.current()
    const libraryCards = this.cards.byPlayer(player, 'library')

    if (libraryCards.length === 0) {
      this.log.add({
        template: '{player} tries to draw a card, but their library is empty',
        args: { player }
      })
      return
    }

    const card = libraryCards[0]
    card.moveTo(this.zones.byPlayer(player, 'hand'))

    if (!opts.silent) {
      this.log.add({
        template: '{player} draws {card}',
        args: { player, card }
      })
    }
  }

  aDrawGame(player: Player): void {
    this.log.add({
      template: '{player} declares a draw',
      args: { player },
      classes: ['draw-game']
    })
    throw new GameOverEvent({
      player: 'nobody',
      reason: 'Draw Game',
    })
  }

  aDrawSeven(player: Player, opts: { silent?: boolean } = {}): void {
    if (!opts.silent) {
      this.log.add({
        template: '{player} draws 7 cards',
        args: { player }
      })
    }
    for (let i = 0; i < 7; i++) {
      this.aDraw(player, { silent: true })
    }
  }

  aHideAll(player: Player, zoneId: string): void {
    const zone = this.zones.byId(zoneId)
    zone.cardlist().forEach(card => this.mHide(card))

    this.log.add({
      template: `{player} hides {zone}`,
      args: { player, zone }
    })
  }

  aImportCard(player: Player, data: ImportData): void {
    for (let i = 0; i < data.count; i++) {
      const card = this.mInitializeCard(data.card, player)
      card.annotation = data.annotation
      card.token = data.isToken
      card.reveal()

      const zone = this.zones.byId(data.zoneId)
      const owner = this.players.byZone(zone)
      zone.push(card)

      // Card was moved to stack.
      if (zone.id.endsWith('.stack')) {
        this.log.addStackPush(player, card)
        this.log.indent()
      }
      else {
        this.log.add({
          template: "{card} imported to {zone}",
          args: { player: owner, card, zone },
        })
      }
    }
  }

  aSecret(player: Player | null, cardId: string): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)
    card.secret = true
    card.hide()

    this.log.add({
      template: '{player} makes a card in {zone} secret',
      args: { player, zone: card.zone }
    })
  }

  aMorph(player: Player | null, cardId: string): void {
    player = player || this.players.current()
    const zone = this.zones.byPlayer(player, 'stack')
    const card = this.cards.byId(cardId)
    card.morph = true
    this.aMoveCard(player, cardId, zone.id, 0)
  }

  aMoveAll(player: Player, sourceId: string, targetId: string): void {
    const source = this.zones.byId(sourceId)
    const toMove = source.cardlist()
    for (const card of toMove) {
      this.aMoveCard(player, card.id as string, targetId)
    }
  }

  aMoveCard(player: Player | null, cardId: string, destId: string, destIndex?: number): void {
    player = player || this.players.current()

    const card = this.cards.byId(cardId)
    const startingZone = card.zone as unknown as Zone
    const dest = this.zones.byId(destId)

    const enforceOrdering = dest.name === 'graveyard'
    if (enforceOrdering) {
      destIndex = 0
    }

    card.moveTo(dest, destIndex)

    if (dest.id.endsWith('stack')) {
      this.log.addStackPush(player, card)
    }

    else if (startingZone.id.endsWith('stack')) {
      // Say nothing. This is handled in the move card functionality.
    }

    else if (startingZone !== dest || dest.id.endsWith('library')) {
      this.log.add({
        template: '{player} moves {card} from {zone1} to {zone2}',
        args: {
          player,
          card,
          zone1: startingZone,
          zone2: dest,
        }
      })
    }


    // If the card moved from a non-battlefield zone to a battlefield zone,
    // add counters to it if appropriate.
    if (card.zone) {  // Do this check because tokens actually disappear when they move sometimes.

      const endingZone = card.zone as unknown as Zone
      if (!this.checkIsBattlefieldZone(startingZone) && this.checkIsBattlefieldZone(endingZone)) {

        // Loyalty counters are a special case
        if (card.data.card_faces[0].loyalty) {
          this.aAddCounter(player, cardId, 'loyalty', { noIncrement: true })

          const counters = parseInt(card.data.card_faces[0].loyalty)
          if (!isNaN(counters)) {
            this.aAdjustCardCounter(player, cardId, 'loyalty', counters)
          }
        }

        // Defense counters are a special case
        else if (card.data.card_faces[0].defense) {
          this.aAddCounter(player, cardId, 'defense', { noIncrement: true })
          this.aAdjustCardCounter(player, cardId, 'defense', parseInt(card.data.card_faces[0].defense))
        }

        // All other counters, infer their existence on the card and add an empty counter
        // field for them.
        else if (card.data.card_faces[0].oracle_text) {
          const exceptions = ['a', 'any', 'all', 'and', 'another', 'be', 'crank!', 'each', 'five', 'get', 'goes', 'had', 'have', 'instead', 'is', 'may', 'no', 'of', 'that', 'those', 'three', 'was', 'with', 'would', 'x', ]
          const re = /([^ ]+) counter/
          const text = card.data.card_faces[0].oracle_text
          const match = re.exec(text)
          if (match) {
            const kind = match[1].toLowerCase()
            if (exceptions.includes(kind)) {
              // do nothing
            }
            else if (kind.startsWith('(')) {
              // do nothing
            }
            else if (kind.endsWith(',')) {
              // do nothing
            }
            else {
              this.aAddCounter(player, cardId, kind, { noIncrement: true })
            }
          }
        }
      }
    }
  }

  aMoveRevealed(player: Player, sourceId: string, targetId: string): void {
    const source = this.zones.byId(sourceId)
    const numPlayers = this.players.all().length

    const toMove = util
      .array
      .takeWhile(source.cardlist(), (card: MagicCardType) => card.visibility.length === numPlayers)

    for (const card of toMove) {
      this.aMoveCard(player, card.id as string, targetId)
    }
  }

  aMulligan(player: Player): void {
    this.log.add({
      template: '{player} takes a mulligan',
      args: { player }
    })
    this.log.indent()

    const library = this.zones.byPlayer(player, 'library')
    for (const card of this.cards.byPlayer(player, 'hand')) {
      card.moveTo(library)
    }

    library.shuffle()

    this.aDrawSeven(player)
    this.log.outdent()
  }

  aPassPriority(actor: Player, targetName?: string): void {
    const player = targetName ? this.players.byName(targetName) : this.players.next()
    this.players.passToPlayer(player)

    const indent = this.log.getIndent()
    this.log.setIndent(1)
    this.log.add({
      template: '{player} gets priority',
      args: { player },
      classes: ['pass-priority'],
    })
    this.log.setIndent(indent)
  }

  aReveal(player: Player | null, cardId: string | MagicCardType): void {
    player = player || this.players.current()
    const card: MagicCardType = (cardId instanceof MagicCard ? cardId : this.cards.byId(cardId as string)) as MagicCardType

    card.reveal()
    this.log.add({
      template: '{player} reveals {card} from {zone}',
      args: { player, card, zone: card.zone },
    })
  }

  aRevealAll(player: Player, zoneId: string): void {
    const zone = this.zones.byId(zoneId)
    zone.cardlist().forEach(card => card.reveal())

    this.log.add({
      template: `{player} reveals {zone}`,
      args: { player, zone }
    })
  }

  aRevealNext(player: Player, zoneId: string): void {
    const zone = this.zones.byId(zoneId)
    const cards = zone.cardlist()
    const nextIndex = cards.findIndex(card => card.visibility.length !== this.players.all().length)

    if (nextIndex === -1) {
      this.log.add({
        template: 'No more cards to reveal in {zone}',
        args: { zone },
      })
      return
    }

    const card = cards[nextIndex]
    card.reveal()
    this.log.add({
      template: `{player} reveals the next card in {zone} (top+${nextIndex}): {card}`,
      args: { player, zone, card }
    })
  }

  aSelectPhase(player: Player, phase: string): void {
    this.mClearStack()
    this.state.phase = phase

    if (phase === 'start turn') {
      this.log.setIndent(0)
      this.log.add({
        template: "{player}'s turn",
        args: {
          player: this.players.current(),
          classes: ['start-turn'],
        }
      })
      this.log.indent()
      this.state.turnPlayer = this.players.current()
    }
    else {
      this.log.setIndent(1)
      this.log.add({
        template: `phase: ${phase}`,
        classes: ['set-phase'],
      })
      this.log.indent()
    }


    // Special handling for some phases

    if (phase === 'untap') {
      [
        ...this.cards.byPlayer(player, 'creatures'),
        ...this.cards.byPlayer(player, 'battlefield'),
        ...this.cards.byPlayer(player, 'land'),
      ].flat()
        .filter(card => !card.noUntap)
        .forEach(card => this.mUntap(card))
    }
    else if (phase === 'draw') {
      this.aDraw()
    }
    else if (phase === 'end') {
      this.log.indent()
      for (const card of this.cards.all()) {
        if (card.annotationEOT) {
          this.log.add({
            template: `{card} status ${card.annotationEOT} clears`,
            args: { card }
          })
          card.annotationEOT = ''
        }

        for (const tracker of Object.keys(card.trackers)) {
          this.log.add({
            template: `{card} tracker ${tracker} clears`,
            args: { card }
          })
          card.trackers[tracker] = 0
        }
      }
      this.log.outdent()
    }

    // Move all cards out of the attackers and blockers zones
    if (!this.utilCombatPhases().includes(phase)) {
      for (const player of this.players.all()) {
        const creaturesZone = this.zones.byPlayer(player, 'creatures')

        for (const zoneName of ['attacking', 'blocking']) {
          const cards = this.cards.byPlayer(player, zoneName)
          for (const card of cards) {
            card.moveTo(creaturesZone)
          }
        }
      }
    }
  }

  aSetNoUntap(player: Player, cardId: string, value: boolean): void {
    const card = this.cards.byId(cardId)
    card.noUntap = value

    if (value) {
      this.log.add({
        template: '{card} will no longer auto-untap',
        args: { card },
      })
    }
    else {
      this.log.add({
        template: '{card} will untap as normal',
        args: { card },
      })
    }
  }

  aShuffle(player: Player, zoneId: string): void {
    const zone = this.zones.byId(zoneId)
    zone.cardlist().forEach(card => card.hide())
    zone.shuffle()
    this.log.add({
      template: '{player} shuffles {zone}',
      args: { player, zone }
    })
  }

  aShuffleBottom(player: Player, zoneId: string, count: number): void {
    const zone = this.zones.byId(zoneId)
    zone.cardlist().slice(-count).forEach(card => card.hide())
    zone.shuffleBottom(count)
    this.log.add({
      template: '{player} shuffles the bottom {count} cards of {zone}',
      args: { player, count, zone }
    })
  }

  aStackEffect(player: Player, cardId: string): void {
    const card = this.cards.byId(cardId)
    const controller = this.players.byController(card)
    const stack = this.zones.byPlayer(controller, 'stack')

    const data: TokenData = {
      zoneId: stack.id,
      count: 1,
      name: 'effect: ' + card.name(),
    }

    this.aCreateToken(controller, data, { silent: true })[0]
  }

  aTap(player: Player, cardId: string): void {
    const card = this.cards.byId(cardId)
    this.mTap(card)
    this.log.add({
      template: 'tap: {card}',
      args: { card }
    })
  }

  aTapAll(player: Player, zoneId: string): void {
    const cards = this.zones.byId(zoneId).cardlist()
    for (const card of cards) {
      this.aTap(player, card.id as string)
    }
  }

  aUnmorph(player: Player | null, cardId: string): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)
    card.morph = false
    card.reveal()
    this.log.add({
      template: '{player} unmorphs {card}',
      args: { player, card },
    })
  }

  aUnsecret(player: Player | null, cardId: string): void {
    player = player || this.players.current()
    const card = this.cards.byId(cardId)
    card.secret = false
    this.mAdjustCardVisibility(card)
    this.log.add({
      template: '{player} unsecrets {card}',
      args: { player, card },
    })
  }

  aUntap(player: Player, cardId: string): void {
    const card = this.cards.byId(cardId)
    card.tapped = false
    this.log.add({
      template: 'untap: {card}',
      args: { card }
    })
  }

  aViewAll(player: Player, zoneId: string): void {
    const zone = this.zones.byId(zoneId)
    zone.sortByName()
    zone.cardlist().forEach(card => card.show(player))

    this.log.add({
      template: `{player} views {zone}`,
      args: { player, zone },
    })
  }

  aViewNext(player: Player, zoneId: string): void {
    const zone = this.zones.byId(zoneId)
    const cards = zone.cardlist()
    const nextIndex = cards.findIndex(card => !card.visible(player))

    if (nextIndex === -1) {
      this.log.add({
        template: 'No more cards for {player} to view in {zone}',
        args: { player, zone },
      })
      return
    }

    const card = cards[nextIndex]
    card.show(player)
    this.log.add({
      template: `{player} views the next card in {zone} (top+${nextIndex})`,
      args: { player, zone }
    })
  }

  aViewTop(player: Player, zoneId: string, count: number): void {
    const zone = this.zones.byId(zoneId)
    const cards = zone.cardlist()
    count = Math.min(count, cards.length)

    for (let i = 0; i < count; i++) {
      util.array.pushUnique(cards[i].visibility, player)
    }

    this.log.add({
      template: `{player} views the top ${count} cards of {zone}`,
      args: { player, zone },
    })
  }

  checkCardIsVisible(player: Player, card: MagicCardType): boolean {
    // TODO: deprecate
    return card.visible(player)
  }

  checkIsBattlefieldZone(zone: Zone): boolean {
    return (
      zone.id.endsWith('battlefield')
      || zone.id.endsWith('creatures')
      || zone.id.endsWith('land')
    )
  }

  getDeckByPlayer(player: Player): DeckWrapper | null {
    const deckSelectAction = this.responses.find(r => r.actor === player.name && r.deckData)
    if (deckSelectAction) {
      return wrappers.deck.fromGameJSON(deckSelectAction.deckData, this.cardWrapper)
    }
    else {
      return null
    }
  }

  getDecksSelected(): boolean {
    return this.state.decksSelected || false
  }

  getNextLocalId(): number {
    this.state.nextLocalId += 1
    return this.state.nextLocalId
  }

  getPhase(): string {
    return this.state.phase
  }

  getPlayerTurn(): Player | null {
    return this.state.turnPlayer
  }

  getZoneIndexByCard(card: MagicCardType): number {
    const zone = card.zone as unknown as Zone
    const zoneCards = zone.cardlist()
    return zoneCards.indexOf(card)
  }

  mAdjustCardVisibility(card: MagicCardType): void {
    const zone = card.zone as unknown as Zone

    if (card.secret) {
      card.hide()
    }
    else if (card.morph) {
      card.hide()
      card.show(this.players.byController(card))
    }
    else if (zone.kind() === 'public') {
      card.reveal()
    }
    else if (zone.kind() === 'private' && zone.owner()) {
      card.show(zone.owner())
    }
    else if (zone.kind() === 'hidden') {
      // do nothing
    }
    else {
      throw new Error(`Unhandled zone kind '${zone.kind()}' for zone '${zone.id}'`)
    }
  }

  mAttach(target: MagicCardType, attachee: MagicCardType): void {
    attachee.attachedTo = target
    util.array.pushUnique(target.attached, attachee)

    this.log.add({
      template: '{card1} attached to {card2}',
      args: {
        card1: attachee,
        card2: target,
      },
    })
  }

  mDetach(card: MagicCardType): void {
    this.log.add({
      template: '{card1} detached from {card2}',
      args: {
        card1: card,
        card2: card.attachedTo,
      },
    })

    util.array.remove(card.attachedTo!.attached, card)
    card.attachedTo = null
  }

  mClearStack(): void {

    const toClear: MagicCardType[] = []

    for (const player of this.players.all()) {
      const cards = this.cards.byPlayer(player, 'stack')
      for (const card of cards) {
        toClear.push(card)
      }
    }

    if (toClear.length > 0) {
      this.log.add({ template: 'clearing stack' })
      this.log.indent()

      for (const card of toClear) {
        const owner = this.players.byOwner(card)
        const graveyard = this.zones.byPlayer(owner, 'graveyard')
        card.moveTo(graveyard)
      }
      this.log.outdent()
    }
  }

  mHide(card: MagicCardType): void {
    const zone = card.zone as unknown as Zone
    if (zone.kind() === 'public') {
      throw new Error(`Can't hide cards in public zone ${zone.id}`)
    }
    else if (zone.kind() === 'private') {
      card.hide()
      card.show(zone.owner())
    }
    else if (zone.kind() === 'hidden') {
      card.hide()
    }
    else {
      throw new Error(`Unhandled zone type ${zone.kind()}`)
    }
  }

  mInitializeCard(data: CardData, owner: Player): MagicCardType {
    const card = new this.cardWrapper(this, data)
    card.id = this.getNextLocalId()
    card.owner = owner
    card.activeFace = card.name(0)

    this.cards.register(card)
    return card
  }

  mMaybeClearAnnotations(card: MagicCardType): void {
    const validZones = ['creatures', 'battlefield', 'land', 'attacking', 'blocking']

    if (!validZones.some(id => card.zone.id.endsWith(id))) {
      card.annotation = ''
      card.annotationEOT = ''
    }
  }

  mMaybeClearCounters(card: MagicCardType): void {
    const validZones = ['creatures', 'battlefield', 'land', 'attacking', 'blocking']

    if (!validZones.some(id => card.zone.id.endsWith(id))) {
      Object
        .keys(card.counters)
        .forEach(c => card.counters[c] = 0)
    }
  }

  mMaybeRemoveTokens(card: MagicCardType): void {
    const validZones = ['creatures', 'battlefield', 'land', 'stack', 'attacking', 'blocking', 'command']

    if (card.token && !validZones.some(id => card.zone.id.endsWith(id))) {
      this.log.indent()

      if (!card.name().startsWith('effect: ')) {
        this.log.add({
          template: '{card} token ceases to exist',
          args: { card }
        })
      }
      this.log.outdent()

      const zone = card.zone as unknown as Zone
      zone.remove(card)
      card.owner = undefined
    }
  }

  mTap(card: MagicCardType): void {
    card.tapped = true
  }

  mUntap(card: MagicCardType): void {
    card.tapped = false
  }

  /**
     The expected shape of data matches the output of toGameJSON in DeckWrapper (deck.wrapper.js).
   */
  setDeck(player: Player, data: DeckData): void {
    this.log.add({
      template: '{player} has selected a deck',
      args: { player },
    })

    const init = (rawCards: CardData[], zoneName: string): void => {
      const cards: MagicCardType[] = []
      for (const raw of rawCards) {
        const card = this.mInitializeCard(raw, player)
        cards.push(card)
      }
      const zone = this.zones.byPlayer(player, zoneName)
      zone.initializeCards(cards)

      if (zoneName === 'library') {
        zone.shuffle()
      }
      else {
        zone.sortByName()
      }
    }

    init(data.cards.main, 'library')
    init(data.cards.side, 'sideboard')
    init(data.cards.command, 'command')
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Utility functions

  utilCombatPhases(): string[] {
    return ['c begin', 'attackers', 'blockers', 'damage', 'c end']
  }

  utilSerializeObject(obj: { id?: string } | string): string {
    if (typeof obj === 'object') {
      util.assert(obj.id !== undefined, 'Object has no id. Cannot serialize.')
      return obj.id!
    }
    else if (typeof obj === 'string') {
      return obj
    }
    else {
      throw new Error(`Cannot serialize element of type ${typeof obj}`)
    }
  }
}

function MagicFactory(settings: unknown, viewerName?: string): Magic {
  const data = GameFactory(settings as Parameters<typeof GameFactory>[0])
  return new Magic(data, viewerName)
}

function factoryFromLobby(lobby: LobbyData): unknown {
  return GameFactory({
    game: 'Magic',
    name: lobby.name,
    format: lobby.options.format,
    linkedDraftId: lobby.options.linkedDraftId,
    players: lobby.users,
    seed: lobby.seed,
  })
}

const draft = {
  cube: cubeDraft,
  pack: pack,
}

const utilExports = {
  card: cardUtilModule,
  wrapper: wrappers,
}

export {
  GameOverEvent,
  Magic,
  MagicFactory,

  MagicCard,

  Magic as constructor,
  factoryFromLobby as factory,
  res,
  draft,
  utilExports as util,
}

export type {
  Player,
  Zone,
  MagicState,
}
