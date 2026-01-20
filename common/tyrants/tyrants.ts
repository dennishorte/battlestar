import {
  Game,
  GameFactory,
  GameOverEvent,
  SerializedGame,
  GameState,
  GameSettings,
  GameOverData,
} from './../lib/game.js'
import {
  BasePlayerInterface,
  BaseZoneInterface,
} from './../lib/game/index.js'
import * as res from './res/index.js'

import { TyrantsLogManager } from './TyrantsLogManager.js'
import { TyrantsMapZone } from './TyrantsMapZone.js'
import { TyrantsToken } from './TyrantsToken.js'
import { TyrantsZone } from './TyrantsZone.js'
import { TyrantsActionManager } from './TyrantsActionManager.js'
import { TyrantsCardManager } from './TyrantsCardManager.js'
import { TyrantsPlayerManager } from './TyrantsPlayerManager.js'
import { TyrantsZoneManager } from './TyrantsZoneManager.js'

import type { TyrantsMapZone as TyrantsMapZoneType } from './TyrantsMapZone.js'
import type { TyrantsToken as TyrantsTokenType } from './TyrantsToken.js'
import type { TyrantsZone as TyrantsZoneType } from './TyrantsZone.js'

interface Player extends BasePlayerInterface {
  color?: string
  addCounter(name: string): void
  getCounter(name: string): number
  setCounter(name: string, value: number): void
  incrementCounter(name: string, amount?: number, opts?: { silent?: boolean }): void
}

interface Card {
  id: string
  name: string
  zone: TyrantsZoneType | TyrantsMapZoneType
  owner?: Player
  visibility: Player[]
  cost: number
  points: number
  innerPoints: number
  aspect?: string
  race?: string
  autoplay?: boolean
  isTroop?: boolean
  isSpy?: boolean
  home?: TyrantsZoneType
  triggers?: CardTrigger[]
  impl(game: Tyrants, player: Player, opts: { card: Card }): void
  moveTo(zone: TyrantsZoneType | TyrantsMapZoneType): void
  getOwnerName(): string
}

interface CardTrigger {
  kind: string
  impl(game: Tyrants, player: Player, opts: { card: Card; forcedBy?: string }): unknown
}

interface ControlMarker {
  locName: string
  ownerName: string
  influence: number
  points?: number
  total: boolean
}

interface EndOfTurnAction {
  player: Player
  source: Card
  action: string
  forcedBy?: string
  aspect?: string
  opts?: { optional?: boolean }
  fn?: (game: Tyrants, player: Player) => void
}

interface ActionChoice {
  title: string
  choices: string[]
  min: number
  max: number
}

interface ChosenAction {
  title?: string
  action?: string
  selection?: string[]
  location?: string
}

interface ChooseOneOption {
  title: string
  impl: (game: Tyrants, player: Player, opts?: Record<string, unknown>) => void
}

interface CascadeOpts {
  key: string
  value: unknown
  maxCost: number
}

interface CollectTargetsOpts {
  loc?: TyrantsMapZoneType
  anywhere?: boolean
  whiteOnly?: boolean
  noWhite?: boolean
  noTroops?: boolean
  noSpies?: boolean
}

interface DeployOpts {
  troop?: TyrantsTokenType
  white?: boolean
  anywhere?: boolean
}

interface DiscardOpts {
  zone?: string
  forced?: boolean
  forcedBy?: string
  requireThree?: boolean
  title?: string
  min?: number
  max?: number
}

interface DevourOpts {
  zone?: string
  then?: (opts: { card: Card }) => void
}

interface BuyActionOpts {
  aspect?: string
}

interface ScoreBreakdown {
  deck: number
  'inner circle': number
  'trophy hall': number
  control: number
  'total control': number
  'victory points': number
  total: number
}

interface TyrantsSettings extends GameSettings {
  map: string
  expansions: string[]
  chooseColors?: boolean
  menzoExtraNeutral?: boolean
}

interface TyrantsState extends GameState {
  turn: number
  endOfTurnActions: EndOfTurnAction[]
  ghostFlag: boolean
  initializationComplete: boolean
  endGameTriggered?: boolean
}

interface CardData {
  all: Card[]
  byName: Record<string, Card[]>
  byExpansion: Record<string, Card[]>
}

interface Lobby {
  name: string
  seed: unknown
  users: unknown[]
  options: {
    expansions: string[]
    map: string
    menzoExtraNeutral?: boolean
  }
}

class Tyrants extends Game<TyrantsState, TyrantsSettings, GameOverData, Card, TyrantsZoneType, Player> {
  declare random: () => number
  doingSetup: boolean = false

  constructor(serialized_data: SerializedGame, viewerName?: string) {
    super(serialized_data, viewerName, {
      LogManager: TyrantsLogManager,
      ActionManager: TyrantsActionManager,
      CardManager: TyrantsCardManager,
      PlayerManager: TyrantsPlayerManager,
      ZoneManager: TyrantsZoneManager,
    })
  }

  _mainProgram(): void {
    this.initialize()
    this.chooseInitialLocations()
    this.mainLoop()
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Initialization

  initialize(): void {
    this.log.add({ template: 'Initializing' })
    this.log.indent()

    this.initializePlayers()
    this.initializeZones()
    this.initializeCards()
    this.initializeTokens()
    this.initializeStartingHands()
    this.initializeTransientState()

    this.log.outdent()

    this.state.ghostFlag = false
    this.state.initializationComplete = true
    this.doingSetup = true
    this._breakpoint('initialization-complete')
    this.doingSetup = false
  }

  initializeZones(): void {
    this.initializeMapZones()
    this.initializeMarketZones()
    this.initializePlayerZones()
    this.initializeTokenZones()

    this.zones.register(new TyrantsZone(this, 'devoured', 'devoured', 'public'))
  }

  initializePlayers(): void {
    for (const player of this.players.all()) {
      player.addCounter('points')
      player.addCounter('influence')
      player.addCounter('power')
      player.addCounter('reduce-draw')
    }
  }

  initializeMapZones(): void {
    for (const data of res.maps[this.settings.map]) {
      const zone = new TyrantsMapZone(this, data)
      this.zones.register(zone)
    }
  }

  initializeMarketZones(): void {
    this.zones.register(new TyrantsZone(this, 'market', 'market', 'public'))
    this.zones.register(new TyrantsZone(this, 'priestess', 'priestess', 'public'))
    this.zones.register(new TyrantsZone(this, 'guard', 'guard', 'public'))
    this.zones.register(new TyrantsZone(this, 'outcast', 'outcast', 'public'))
  }

  initializeTokenZones(): void {
    this.zones.register(new TyrantsZone(this, 'neutrals', 'neutrals', 'public'))
  }

  initializePlayerZones(): void {
    const self = this

    function _addPlayerZone(player: Player, name: string, kind: string): void {
      const id = `players.${player.name}.${name}`
      const zone = new TyrantsZone(self, id, id, kind, player)
      self.zones.register(zone)
    }

    for (const player of this.players.all()) {
      _addPlayerZone(player, 'deck', 'hidden')
      _addPlayerZone(player, 'played', 'public')
      _addPlayerZone(player, 'discard', 'public')
      _addPlayerZone(player, 'trophyHall', 'public')
      _addPlayerZone(player, 'hand', 'private')
      _addPlayerZone(player, 'innerCircle', 'public')

      _addPlayerZone(player, 'troops', 'public')
      _addPlayerZone(player, 'spies', 'public')
    }
  }

  initializeCards(): void {
    const expansions = this.getExpansionList()

    this.log.add({ template: 'Loading expansion: ' + expansions[0] })
    this.log.add({ template: 'Loading expansion: ' + expansions[1] })

    const cardData: CardData = res.cards.factory(this)
    cardData.all.forEach((card: Card) => this.cards.register(card))

    ;(this.zones.byId('priestess') as any).initializeCards(cardData.byName['Priestess of Lolth'])
    ;(this.zones.byId('guard') as any).initializeCards(cardData.byName['House Guard'])
    ;(this.zones.byId('outcast') as any).initializeCards(cardData.byName['Insane Outcast'])

    // Market deck
    const marketZone = new TyrantsZone(this, 'marketDeck', 'marketDeck', 'private')
    this.zones.register(marketZone)

    const marketCards = this
      .getExpansionList()
      .flatMap((exp: string) => cardData.byExpansion[exp])
    ;(marketZone as any).initializeCards(marketCards)
    marketZone.shuffle()

    // Market cards
    this.log.add({ template: 'Adding starting market cards' })
    this.log.indent()
    this.mRefillMarket(true)
    this.log.outdent()

    // Starter decks
    let x = 0
    let y = 0
    for (const player of this.players.all()) {
      const cards: Card[] = []

      for (let i = 0; i < 7; i++) {
        const card = cardData.byName['Noble'][x]
        cards.push(card)
        x += 1
      }

      for (let i = 0; i < 3; i++) {
        const card = cardData.byName['Soldier'][y]
        cards.push(card)
        y += 1
      }

      const deck = this.zones.byPlayer(player, 'deck')
      ;(deck as any).initializeCards(cards)
      deck.shuffle()
    }
  }

  initializeTokens(): void {
    for (const player of this.players.all()) {
      const troops: TyrantsTokenType[] = []
      for (let i = 0; i < 40; i++) {
        const name = `troop-${player.name}`
        const token = new TyrantsToken(this, name + '-' + i, name)
        this.cards.register(token)
        token.isTroop = true
        token.owner = player
        troops.push(token)
      }
      ;(this.zones.byPlayer(player, 'troops') as any).initializeCards(troops)

      const spies: TyrantsTokenType[] = []
      for (let i = 0; i < 5; i++) {
        const name = `spy-${player.name}`
        const token = new TyrantsToken(this, name + '-' + i, name)
        this.cards.register(token)
        token.isSpy = true
        token.owner = player
        spies.push(token)
      }
      ;(this.zones.byPlayer(player, 'spies') as any).initializeCards(spies)
    }

    // Neutrals
    const neutrals: TyrantsTokenType[] = []
    for (let i = 0; i < 80; i++) {
      const token = new TyrantsToken(this, 'neutral-' + i, 'neutral')
      this.cards.register(token)
      token.isTroop = true
      neutrals.push(token)
    }
    ;(this.zones.byId('neutrals') as any).initializeCards(neutrals)


    // Place neutrals on map
    const neutralZone = this.zones.byId('neutrals') as TyrantsZoneType
    for (const loc of this.getLocationAll()) {
      for (let i = 0; i < loc.neutrals; i++) {
        ;(neutralZone.peek() as any).moveTo(loc)
      }
    }

    if (this.settings.menzoExtraNeutral) {
      const menzo = this.getLocationByName('Menzoberranzan')
      ;(neutralZone.peek() as any).moveTo(menzo)
    }
  }

  initializeStartingHands(): void {
    for (const player of this.players.all()) {
      this.mRefillHand(player)
    }
  }

  initializeTransientState(): void {
    this.state.turn = 0
    this.state.endOfTurnActions = []
  }

  chooseInitialLocations(): void {
    this.log.add({ template: 'Choosing starting locations' })
    this.log.indent()

    for (const player of this.players.all()) {
      this.aChooseColor(player)

      const choices = this
        .getLocationAll()
        .filter((loc: TyrantsMapZoneType) => loc.start)
        .filter((loc: TyrantsMapZoneType) => loc.getTroops().filter((t: any) => t.name !== 'neutral').length === 0)

      const loc = this.aChooseLocation(player, choices, { title: 'Choose starting location' })
      this.aDeploy(player, loc!)
    }

    this.log.outdent()
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Main Loop

  mainLoop(): void {
    while (true) {
      this.log.setIndent(0)
      this.log.add({
        template: '{player} turn {count}',
        args: {
          player: this.players.current(),
          count: this.getRound(),
        },
        classes: ['player-turn'],
      })

      this.log.indent()

      this.preActions()
      this.doActions()

      this.log.indent()
      this.endOfTurn()
      this.cleanup()

      this.drawHand()
      this.nextPlayer()
      this.checkForEndOfGame()
    }
  }

  preActions(): void {
    const player = this.players.current()

    // Gain influence from site control tokens.
    const markers = this.getControlMarkers(player)
    for (const marker of markers) {
      const loc = this.getLocationByName(marker.locName)
      player.incrementCounter('influence', marker.influence, { silent: true })
      this.log.add({
        template: '{player} gains {count} influence for control of {loc}',
        args: {
          player,
          loc,
          count: marker.influence
        }
      })
    }
  }

  doActions(): void {
    const player = this.players.current()

    while (true) {
      const chosenAction = this.requestInputSingle({
        actor: player.name,
        title: `Choose Action`,
        choices: this._generateActionChoices(),
      })[0] as string | ChosenAction

      if (chosenAction === 'Pass') {
        this.log.add({
          template: '{player} passes',
          args: { player }
        })
        break
      }

      else if (chosenAction === 'Auto-play Cards') {
        this.aAutoPlayCards()
        continue
      }

      else if (typeof chosenAction === 'object' && chosenAction.action === 'place-troop-with-power') {
        this.aDeployWithPowerAt(player, chosenAction.location)
        continue
      }

      const action = chosenAction as ChosenAction
      const name = action.title
      const arg = action.selection![0]

      if (name === 'Play Card') {
        const card = this
          .cards.byPlayer(player, 'hand')
          .find((c: Card) => c.name === arg)
        this.aPlayCard(player, card!)
        continue
      }
      else if (name === 'Recruit') {
        this.log.add({
          template: '{player} recruit',
          args: { player }
        })
        this.log.indent()
        this.aRecruit(player, arg)
        this.log.outdent()
        continue
      }
      else if (name === 'Use Power') {
        if (arg === 'Deploy a Troop') {
          this.aDeployWithPowerAt(player)
          continue
        }

        else if (arg === 'Assassinate a Troop') {
          this.log.add({
            template: '{player} power: Assassinate a Troop',
            args: { player }
          })
          this.log.indent()
          this.aChooseAndAssassinate(player)
          player.incrementCounter('power', -3)
          this.log.outdent()
          continue
        }

        else if (arg === 'Return an Enemy Spy') {
          this.log.add({
            template: '{player} power: Return an Enemy Spy',
            args: { player }
          })
          this.log.indent()
          this.aChooseAndReturn(player, { noTroops: true })
          player.incrementCounter('power', -3)
          this.log.outdent()
          continue
        }

        else {
          throw new Error(`Unknown power action: ${arg}`)
        }
      }
      else {
        throw new Error(`Unknown action: ${name}`)
      }
    }
  }

  _generateActionChoices(): (string | ActionChoice | undefined)[] {
    const choices: (string | ActionChoice | undefined)[] = []
    choices.push(this._generateCardActions())
    choices.push(this._generateAutoCardAction())
    choices.push(this._generateBuyActions())
    choices.push(this._generatePowerActions())
    choices.push(this._generatePassAction())
    return choices.filter(action => Boolean(action))
  }

  _generateCardActions(): ActionChoice | undefined {
    const choices: string[] = []
    for (const card of this.cards.byPlayer(this.players.current(), 'hand')) {
      choices.push(card.name)
    }

    choices.sort()

    if (choices.length > 0) {
      return {
        title: 'Play Card',
        choices,
        min: 0,
        max: 1,
      }
    }
    else {
      return undefined
    }
  }

  _generateAutoCardAction(): string | undefined {
    const player = this.players.current()
    const cards = this.cards.byPlayer(player, 'hand')

    if (cards.some((card: Card) => card.autoplay)) {
      return 'Auto-play Cards'
    }
    else {
      return undefined
    }
  }

  _generateBuyActions(maxCost: number = 0, opts: BuyActionOpts = {}): ActionChoice | undefined {
    const choices: { card: Card; devoured?: boolean }[] = []

    const priestess = (this.zones.byId('priestess') as TyrantsZoneType).peek() as Card | undefined
    if (priestess) {
      choices.push({ card: priestess })
    }

    const guard = (this.zones.byId('guard') as TyrantsZoneType).peek() as Card | undefined
    if (guard) {
      choices.push({ card: guard })
    }

    const market = ((this.zones.byId('market') as TyrantsZoneType).cardlist() as unknown as Card[])
      .sort((l: Card, r: Card) => l.name.localeCompare(r.name))
      .sort((l: Card, r: Card) => l.cost - r.cost)
    for (const card of market) {
      choices.push({ card })
    }

    if (this.state.ghostFlag) {
      const devoured = ((this.zones.byId('devoured') as TyrantsZoneType).cardlist() as unknown as Card[]).slice(-1)[0]
      if (devoured) {
        choices.push({
          card: devoured,
          devoured: true,
        })
      }
    }

    const influence = maxCost ? maxCost : this.players.current().getCounter('influence')
    const filteredChoices = choices
      .filter(choice => choice.card.cost <= influence)
      .filter(choice => opts.aspect ? choice.card.aspect === opts.aspect : true)
      .map(choice => {
        if (choice.devoured) {
          return 'devoured: ' + choice.card.name
        }
        else {
          return choice.card.name
        }
      })

    if (filteredChoices.length > 0) {
      return {
        title: 'Recruit',
        choices: filteredChoices,
        min: 0,
        max: 1,
      }
    }
    else {
      return undefined
    }
  }

  _generatePowerActions(): ActionChoice | undefined {
    const player = this.players.current()
    const choices: string[] = []

    const power = player.getCounter('power')
    if (
      power >= 1
      && this.cards.byPlayer(player, 'troops').length > 0
      && this.getDeployChoices(player).length > 0
    ) {
      choices.push('Deploy a Troop')
    }
    if (power >= 3) {
      if (this.getAssassinateChoices(player).length > 0) {
        choices.push('Assassinate a Troop')
      }

      if (this._collectTargets(player).spies.length > 0) {
        choices.push('Return an Enemy Spy')
      }
    }

    if (choices.length > 0) {
      return {
        title: 'Use Power',
        choices,
        min: 0,
        max: 1,
      }
    }
    else {
      return undefined
    }
  }

  _generatePassAction(): string {
    return 'Pass'
  }

  _processEndOfTurnActions(): void {
    // Discard
    for (const action of this.state.endOfTurnActions) {
      if (action.action === 'discard') {
        this.log.add({
          template: '{player} must discard a card due to {card}',
          args: { player: action.player, card: action.source }
        })
        this.aChooseAndDiscard(action.player, { forced: true, forcedBy: action.forcedBy })
      }
    }

    // Promotions
    const promos: EndOfTurnAction[] = []

    for (const action of this.state.endOfTurnActions) {
      if (action.action === 'promote-other') {
        promos.push(action)
      }

      else if (action.action === 'promote-aspect') {
        this.log.add({
          template: '{player} may promote a card with aspect {aspect}',
          args: {
            player: action.player,
            aspect: action.aspect,
          }
        })
        const choices = (this
          .cards.byPlayer(action.player, 'played') as Card[])
          .filter((card: Card) => card.aspect === action.aspect)
          .sort((l: Card, r: Card) => l.name.localeCompare(r.name))
        this.aChooseAndPromote(action.player, choices, { min: 1, max: 1 })
      }

      else if (action.action === 'promote-special') {
        if (action.source.name === 'High Priest of Myrkul') {
          this.log.add({
            template: '{player} may promote any number of undead cards',
            args: { player: action.player }
          })
          const choices = (this
            .cards.byPlayer(action.player, 'played') as Card[])
            .filter((card: Card) => card.race === 'undead')
            .sort((l: Card, r: Card) => l.name.localeCompare(r.name))
          this.aChooseAndPromote(action.player, choices, { min: 0, max: choices.length })
        }
        else {
          throw new Error(`Unknown special promotion: ${action.source.name}`)
        }
      }
    }

    const promoChoices: Card[] = []
    for (const promo of promos) {
      this
        .cards.byPlayer(promo.player, 'played')
        .filter((card: Card) => card !== promo.source)
        .forEach((card: Card) => util.array.pushUnique(promoChoices, card))
    }

    if (promoChoices.length > 0) {
      const player = this.players.current()

      const max = promos.length
      const min = promos.filter(p => !p.opts?.optional).length

      this.log.add({
        template: '{player} may promote {max} cards',
        args: { player, max }
      })
      promoChoices.sort((l: Card, r: Card) => l.name.localeCompare(r.name))
      this.aChooseAndPromote(player, promoChoices, { min, max })
    }

    // Special

    for (const action of this.state.endOfTurnActions) {
      if (action.action === 'special') {
        action.fn!(this, action.player)
      }
    }

    this.state.endOfTurnActions = []
  }

  endOfTurn(): void {
    this._processEndOfTurnActions()

    // Gain points for control markers.
    const player = this.players.current()

    const markers = this.getControlMarkers(player)
    for (const marker of markers) {
      if (marker.total && marker.points) {
        player.incrementCounter('points', marker.points, { silent: true })
        this.log.add({
          template: '{player} gains {count} points for total control of {loc}',
          args: {
            player,
            loc: this.getLocationByName(marker.locName),
            count: marker.points
          }
        })
      }
    }

    // Clear till end of turn flags
    this.state.ghostFlag = false
  }

  cleanup(): void {
    const player = this.players.current()
    const playedCards = this.cards.byPlayer(player, 'played')

    this.log.add({
      template: '{player} moves {count} played cards to discard pile.',
      args: {
        player,
        count: playedCards.length
      }
    })

    for (const card of playedCards) {
      card.moveTo(this.zones.byPlayer(player, 'discard'))
    }

    const hand = this.cards.byPlayer(player, 'hand')
    if (hand.length > 0) {
      this.log.add({
        template: '{player} discards {count} remaining cards',
        args: { player, count: hand.length }
      })
      for (const card of hand) {
        card.moveTo(this.zones.byPlayer(player, 'discard'))
      }
    }

    // Clear remaining influence and power
    player.setCounter('power', 0)
    player.setCounter('influence', 0)

    this.checkForEndGameTriggers()
  }

  checkForEndGameTriggers(): void {

    // Any player has zero troops left
    for (const player of this.players.all()) {
      if (this.cards.byPlayer(player, 'troops').length === 0) {
        this.log.add({
          template: '{player} has deployed all of their troops',
          args: { player }
        })
        this.state.endGameTriggered = true
      }
    }

    // The market is depleted
    if ((this.zones.byId('marketDeck') as TyrantsZoneType).cardlist().length === 0) {
      this.log.add({
        template: 'The market is depleted'
      })
      this.state.endGameTriggered = true
    }

    if (this.state.endGameTriggered) {
      this.log.add({
        template: "The end of the game has been triggered. The game will end at the start of {player}'s next turn.",
        args: { player: this.players.first() }
      })
    }
  }

  drawHand(): void {
    this.mRefillHand(this.players.current())
  }

  nextPlayer(): void {
    this.players.advancePlayer()
    this.state.turn += 1
  }

  checkForEndOfGame(): void {
    if (this.state.endGameTriggered && this.players.current() === this.players.first()) {

      const scores = this
        .players
        .all()
        .map((player: Player) => ({
          player,
          score: this.getScore(player)
        }))
        .sort((l: { score: number }, r: { score: number }) => r.score - l.score)

      for (const score of scores) {
        this.log.add({
          template: '{player}: {score}',
          args: {
            player: score.player,
            score: score.score
          }
        })
      }

      if (scores[0].score === scores[1].score) {
        this.log.add({
          template: 'Multiple players are tied for the highest score. There is no tie breaker, so they share the victory.'
        })
        throw new GameOverEvent({
          player: 'All players with the highest score',
          reason: 'Points are tied',
        })
      }

      else {
        throw new GameOverEvent({
          player: scores[0].player.name,
          reason: 'ALL THE POINTS!'
        })
      }
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Alt Actions

  aDeployWithPowerAt(player: Player, locId: string | null = null): void {
    this.log.add({
      template: '{player} power: Deploy a Troop',
      args: { player }
    })
    this.log.indent()

    if (locId) {
      const loc = this.getLocationByName(locId)
      this.aDeploy(player, loc)
    }
    else {
      this.aChooseAndDeploy(player)
    }

    player.incrementCounter('power', -1)
    this.log.outdent()
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Core Functionality

  aCascade(player: Player, opts: CascadeOpts): void {
    const marketZone = this.zones.byId('marketDeck') as TyrantsZoneType

    const unused: Card[] = []
    let found: Card | null = null

    for (const card of marketZone.cardlist() as unknown as Card[]) {
      if ((card as unknown as Record<string, unknown>)[opts.key] === opts.value && card.cost <= opts.maxCost) {
        found = card
        break
      }
      else {
        this.log.add({
          template: 'skipping {card}',
          args: { card }
        })
        unused.push(card)
      }
    }

    for (const card of unused) {
      card.moveTo(marketZone)
    }

    if (found) {
      this.log.add({
        template: '{card} found',
        args: { card: found }
      })
      found.moveTo(this.zones.byPlayer(player, 'hand'))
      this.aPlayCard(player, found)

      // If the player devoured the card as part of using it, they cannot acquire it.
      if (found.zone.id === 'devoured') {
        this.log.add({
          template: '{card} cannot be acquired because it was devoured',
          args: { card: found }
        })
        return
      }

      if (this.actions.chooseYesNo(player, 'Acquire ' + found.name + '?')) {
        this.log.add({
          template: '{player} adds {card} to their deck',
          args: { player, card: found }
        })
        found.moveTo(this.zones.byPlayer(player, 'discard'))
      }
      else {
        this.aDevour(player, found)
      }
    }
    else {
      this.log.add({ template: 'No cards found' })
    }
  }

  aChooseColor(player: Player): void {
    // This option exists so that games in progress when color selection is introduced don't break
    if (!this.settings.chooseColors) {
      return
    }

    const availableColors = (Object.entries(res.colors) as [string, string][])
      .filter(([, hex]) => !this.players.all().some((p: Player) => p.color === hex))
      .map(([name]) => name)

    const chosen = this.actions.choose(player, availableColors, {
      title: 'Choose a player color',
    })
    player.color = res.colors[chosen[0]]
  }

  aChooseLocation(player: Player, locations: TyrantsMapZoneType[], opts: { title?: string; min?: number; max?: number } = {}): TyrantsMapZoneType | undefined {
    const choices = locations
      .map((loc: TyrantsMapZoneType) => loc.name())
      .sort()

    if (!opts.title) {
      opts.title = 'Choose a location'
    }

    const selection = this.actions.choose(player, choices, opts)
    if (selection.length > 0) {
      return locations.find((loc: TyrantsMapZoneType) => loc.name() === selection[0])
    }
  }

  aChooseAndAssassinate(player: Player, opts: { loc?: TyrantsMapZoneType; whiteOnly?: boolean } = {}): TyrantsTokenType | undefined {
    const choices = this.getAssassinateChoices(player, opts)
    const selection = this.actions.choose(player, choices)
    if (selection.length > 0) {
      const [locName, ownerName] = selection[0].split(', ')
      const loc = this.getLocationByName(locName)
      const owner = ownerName === 'neutral' ? 'neutral' : this.players.byName(ownerName)
      return this.aAssassinate(player, loc, owner)
    }
  }

  aChooseAndDevour(player: Player, opts: DevourOpts = {}): void {
    const zoneName = opts.zone ? opts.zone : 'hand'
    const chosen = this.actions.chooseCard(player, this.cards.byPlayer(player, zoneName), {
      min: 0,
      max: 1,
      title: `Devour a card from your ${zoneName}?`,
    })
    if (chosen) {
      this.aDevour(player, chosen)
      if (opts.then) {
        opts.then({ card: chosen })
      }
    }
    else {
      this.log.add({
        template: '{player} choose not to devour a card',
        args: { player },
      })
    }
  }

  aChooseAndDevourMarket(player: Player, opts: { max?: number } = {}): void {
    const chosen = this.actions.chooseCards(player, (this.zones.byId('market') as TyrantsZoneType).cardlist() as any, {
      min: 0,
      max: opts.max || 1,
      title: 'Choose cards to devour from the market',
    })
    if (chosen.length > 0) {
      for (const card of chosen) {
        this.aDevour(player, card)
      }
    }
    else {
      this.log.add({
        template: '{player} choose not to devour a card in the market',
        args: { player },
      })
    }
  }

  aChooseAndDiscard(player: Player, opts: DiscardOpts = {}): Card | undefined {
    if (opts.requireThree) {
      const cardsInHand = this.cards.byPlayer(player, 'hand').length
      if (cardsInHand <= 3) {
        this.log.add({
          template: '{player} has only {count} cards in hand, so does not discard',
          args: { player, count: cardsInHand }
        })
        return
      }
    }

    this.log.add({
      template: '{player} must discard a card',
      args: { player }
    })
    this.log.indent()

    if (!opts.title) {
      opts.title = 'Choose a card to discard'
    }

    const chosen = this.actions.chooseCard(player, this.cards.byPlayer(player, 'hand'), opts as any)
    if (chosen) {
      // Some cards have triggers if an opponent causes you to discard.
      if (opts.forced) {
        const triggers = chosen.triggers || []
        for (const trigger of triggers) {
          if (trigger.kind === 'discard-this') {
            const result = trigger.impl(this, player, { card: chosen, forcedBy: opts.forcedBy })
            this.log.outdent()
            return result as Card | undefined
          }
        }
      }

      // Only get to this on fall-through
      this.aDiscard(player, chosen)
      this.log.outdent()
      return chosen
    }
    else {
      this.log.add({
        template: '{player} cannot or chooses not to discard',
        args: { player }
      })
    }

    this.log.outdent()
  }

  aChooseAndSupplant(player: Player, opts: CollectTargetsOpts = {}): void {
    const troops = this.cards.byPlayer(player, 'troops')
    if (troops.length === 0) {
      this.log.add({
        template: '{player} has no more troops',
        args: { player }
      })
      return
    }

    const choices = this._collectTargets(player, opts).troops
    const selection = this.actions.choose(player, choices)
    if (selection.length > 0) {
      const [locName, ownerName] = selection[0].split(', ')
      const loc = this.getLocationByName(locName)
      const owner = ownerName === 'neutral' ? 'neutral' : this.players.byName(ownerName)
      this.aSupplant(player, loc, owner)
    }
  }

  aChooseAndDeploy(player: Player, opts: DeployOpts = {}): TyrantsMapZoneType | undefined {
    // If the player is deploying a white troop, fetch it from the bank.
    if (opts.white) {
      const white = (this.zones.byId('neutrals') as TyrantsZoneType).peek() as TyrantsTokenType | undefined
      if (!white) {
        this.log.add({ template: 'There are no neutral troops left in the supply' })
        return
      }
      opts.troop = white
    }

    // Ensure there are troops to be deployed
    const troops = this.cards.byPlayer(player, 'troops')
    if (troops.length === 0 && !opts.troop) {
      this.log.add({
        template: '{player} has no more troops',
        args: { player }
      })
      return
    }

    const choices = this.getDeployChoices(player, opts)
    const loc = this.aChooseLocation(player, choices, { title: 'Choose a location to deploy' })
    if (loc) {
      this.aDeploy(player, loc, opts)
    }

    return loc
  }

  // Only supports moving troops.
  aChooseAndMoveTroop(player: Player, opts: CollectTargetsOpts = {}): void {
    const choices = this._collectTargets(player, opts).troops
    const toMove = this.actions.choose(player, choices, { title: "Choose a troop to move" })[0]
    if (toMove) {
      const [locName, ownerName] = toMove.split(', ')
      const source = this.getLocationByName(locName)
      const owner = ownerName === 'neutral' ? 'neutral' : this.players.byName(ownerName)
      const troop = source.getTroops(owner as any)[0]

      const destChoices = this
        .getLocationAll()
        .filter((loc: TyrantsMapZoneType) => loc.checkHasOpenTroopSpace())
        .filter((loc: TyrantsMapZoneType) => loc !== source)

      const dest = this.aChooseLocation(player, destChoices)

      if (!dest) {
        this.log.add({ template: 'No valid targets for moving a troop' })
        return
      }

      util.assert(!!troop, `Invalid selection for moving a troop: ${toMove}`)

      ;(troop as any).moveTo(dest)
      this.log.add({
        template: '{player} moves a {player2} troop from {zone1} to {zone2}',
        args: {
          player,
          player2: owner,
          zone1: source,
          zone2: dest,
        }
      })
    }
  }

  aChooseAndPlaceSpy(player: Player): TyrantsMapZoneType | undefined {
    // Check that the player has spies remaining to place.
    if (this.cards.byPlayer(player, 'spies').length === 0) {
      this.log.add({
        template: '{player} has deployed all their spies',
        args: { player }
      })
      return
    }

    // Player can choose to place a spy on area site that does not have a spy of theirs on it already.
    const choices = this
      .getLocationAll()
      .filter((l: TyrantsMapZoneType) => l.checkIsSite())
      .filter((l: TyrantsMapZoneType) => l.getSpies(player as any).length === 0)

    const loc = this.aChooseLocation(player, choices, { title: 'Choose a location for a spy' })
    if (loc) {
      this.aPlaceSpy(player, loc)
      return loc
    }
  }

  aChooseAndPromote(player: Player, cardsToChoose: Card[], opts: { min?: number; max?: number } = {}): void {
    const choiceNames = cardsToChoose
      .map((c: Card) => c.name)
      .sort()

    const choices = this.actions.choose(player, choiceNames, { ...opts, title: 'Choose cards to promote' })

    const done: Card[] = []
    for (const choice of choices) {
      const card = cardsToChoose.find((c: Card) => c.name === choice && !done.includes(c))
      done.push(card!)
      this.aPromote(player, card!)
    }
  }

  aChooseAndRecruit(player: Player, maxCost: number, opts?: BuyActionOpts): void {
    const choices = this._generateBuyActions(maxCost, opts)

    if (choices) {
      const cardNames = this.actions.choose(player, choices.choices, { ...opts, title: 'Choose cards to recruit' })
      for (const name of cardNames) {
        this.aRecruit(player, name, { noCost: true })
      }
    }
    else {
      this.log.add({ template: 'Not able to recruit any cards' })
    }
  }

  _collectTargets(player: Player, opts: CollectTargetsOpts = {}): { troops: string[]; spies: string[] } {
    let baseLocations: TyrantsMapZoneType[]
    if (opts.loc) {
      baseLocations = [opts.loc]
    }
    else if (opts.anywhere) {
      baseLocations = this.getLocationAll()
    }
    else {
      baseLocations = this.getPresence(player)
    }

    const troops = baseLocations
      .flatMap((loc: TyrantsMapZoneType) => (loc.getTroops() as unknown as TyrantsTokenType[]).map((troop) => [loc, troop] as [TyrantsMapZoneType, TyrantsTokenType]))
      .filter(([, troop]) => troop.owner !== (player as any))
      .filter(([, troop]) => opts.whiteOnly ? !troop.owner : true)
      .filter(([, troop]) => opts.noWhite ? !!troop.owner : true)
      .map(([loc, troop]) => `${loc.name()}, ${troop.getOwnerName()}`)

    const spies = baseLocations
      .flatMap((loc: TyrantsMapZoneType) => (loc.getSpies() as unknown as TyrantsTokenType[]).map((spy) => [loc, spy] as [TyrantsMapZoneType, TyrantsTokenType]))
      .filter(([, spy]) => spy.owner !== (player as any))
      .map(([loc, spy]) => `${loc.name()}, ${spy.getOwnerName()}`)

    return {
      troops: opts.noTroops ? [] : util.array.distinct(troops).sort(),
      spies: opts.noSpies ? [] : util.array.distinct(spies).sort(),
    }
  }

  aChooseAndReturn(player: Player, opts: CollectTargetsOpts = {}): void {
    const targets = this._collectTargets(player, opts)

    const choices: ActionChoice[] = []
    if (targets.troops.length > 0) {
      choices.push({
        title: 'troop',
        choices: targets.troops,
        min: 0,
        max: 1,
      })
    }
    if (targets.spies.length > 0) {
      choices.push({
        title: 'spy',
        choices: targets.spies,
        min: 0,
        max: 1,
      })
    }

    const selection = this.actions.choose(player, choices, {
      title: 'Choose a token to return',
    }) as unknown as ChosenAction[]

    if (selection.length > 0) {
      const kind = selection[0].title
      const [locName, ownerName] = selection[0].selection![0].split(', ')
      const loc = this.getLocationByName(locName)
      const owner = ownerName === 'neutral' ? 'neutral' : this.players.byName(ownerName)

      if (kind === 'spy') {
        this.aReturnSpy(player, loc, owner as Player)
      }
      else if (kind === 'troop') {
        this.aReturnTroop(player, loc, owner)
      }
      else {
        throw new Error(`Unknown return type: ${kind}`)
      }
    }
  }

  aChooseOne(player: Player, choices: ChooseOneOption[], opts: Record<string, unknown> = {}): void {
    const selection = this.actions.choose(player, choices.map((c: ChooseOneOption) => c.title))[0]
    const impl = choices.find((c: ChooseOneOption) => c.title === selection)!.impl

    this.log.add({
      template: '{player} chooses {selection}',
      args: { player, selection }
    })
    impl(this, player, opts)
  }

  aChooseToDiscard(player: Player): void {
    const opponents = this
      .players.opponents(player)
      .filter((p: Player) => this.cards.byPlayer(p, 'hand').length > 3)
      .map((p: Player) => p.name)

    const choice = this.actions.choose(player, opponents, { title: 'Choose an opponent to discard' })
    if (choice.length > 0) {
      const opponent = this.players.byName(choice[0])
      this.aChooseAndDiscard(opponent, { forced: true, forcedBy: player.name })
    }
    else {
      this.log.add({
        template: 'No opponents have more than three cards in hand',
      })
    }
  }

  aDeferDiscard(player: Player, source: Card, forcingPlayer: Player): void {
    this.state.endOfTurnActions.push({
      player,
      source,
      action: 'discard',
      forcedBy: forcingPlayer.name,
    })
  }

  aDeferPromotion(player: Player, source: Card, opts: { optional?: boolean } = {}): void {
    this.state.endOfTurnActions.push({
      player,
      source,
      action: 'promote-other',
      opts,
    })
  }

  aDeferPromotionAspect(player: Player, source: Card, aspect: string): void {
    this.state.endOfTurnActions.push({
      player,
      source,
      aspect,
      action: 'promote-aspect',
    })
  }

  aDeferPromotionSpecial(player: Player, source: Card): void {
    this.state.endOfTurnActions.push({
      player,
      source,
      action: 'promote-special',
    })
  }

  aDeferSpecial(player: Player, source: Card, fn: (game: Tyrants, player: Player) => void): void {
    this.state.endOfTurnActions.push({
      player,
      source,
      action: 'special',
      fn,
    })
  }

  aAutoPlayCards(): void {
    const player = this.players.current()
    const cards = this.cards.byPlayer(player, 'hand')
    for (const card of cards) {
      if (card.autoplay) {
        this.aPlayCard(player, card)
      }
    }
  }

  aAssassinate(player: Player, loc: TyrantsMapZoneType, owner: Player | 'neutral'): TyrantsTokenType {
    const troop = this.mAssassinate(player, loc, owner)
    this.log.add({
      template: '{player} assassinates {card} at {loc}',
      args: {
        player,
        card: troop,
        loc
      }
    })
    return troop
  }

  aDeploy(player: Player, loc: TyrantsMapZoneType, opts: DeployOpts = {}): void {
    const deployed = this.mDeploy(player, loc, opts)
    this.log.add({
      template: '{player} deploys {card} to {loc}',
      args: { player, loc, card: deployed }
    })
  }

  aDevour(player: Player, card: Card, opts: { noRefill?: boolean } = {}): void {
    this.log.add({
      template: '{player} devours {card} from {zone}',
      args: { player, card, zone: card.zone },
    })
    this.mDevour(card)

    if (!opts.noRefill) {
      this.mRefillMarket()
    }
  }

  aDevourThisAnd(player: Player, card: Card, title: string, fn: (game: Tyrants, player: Player) => void): void {
    this.log.add({
      template: `{player} may activate '${title}'`,
      args: { player }
    })
    this.log.indent()
    const doDevour = this.actions.chooseYesNo(player, title)
    if (doDevour) {
      this.aDevour(player, card)
      fn(this, player)
    }
    else {
      this.log.addDoNothing(player)
    }
    this.log.outdent()
  }

  aDiscard(player: Player, card: Card): void {
    card.moveTo(this.zones.byPlayer(player, 'discard'))
    this.log.add({
      template: '{player} discards {card}',
      args: { player, card }
    })
  }

  aDraw(player: Player, opts: { silent?: boolean } = {}): Card | 'no-more-cards' {
    const deck = this.zones.byPlayer(player, 'deck')
    const hand = this.zones.byPlayer(player, 'hand')

    if (deck.cardlist().length === 0) {
      // See if we can reshuffle.
      const discard = this.zones.byPlayer(player, 'discard')
      if (discard.cardlist().length > 0) {
        this.mReshuffleDiscard(player)
      }

      // If not, do nothing.
      else {
        return 'no-more-cards'
      }
    }

    if (!opts.silent) {
      this.log.add({
        template: '{player} draws a card',
        args: { player }
      })
    }
    return (deck.peek() as any).moveTo(hand)
  }


  aPlaceSpy(player: Player, loc: TyrantsMapZoneType): void {
    this.mPlaceSpy(player, loc)
    this.log.add({
      template: '{player} places a spy at {loc}',
      args: { player, loc }
    })
  }

  aPlayCard(player: Player, card: Card): void {
    // There are several cases where a card not owned by the player is played, such as
    // Ulitharid and undead cascade.
  //  util.assert(card.owner === player, 'Card is not owned by player')
    util.assert(card.zone.id.endsWith('hand'), 'Card is not in player hand')

    card.moveTo(this.zones.byPlayer(player, 'played'))
    this.log.add({
      template: '{player} plays {card}',
      args: { player, card }
    })

    this.mExecuteCard(player, card)
  }

  aPromote(player: Player, card: Card, opts: { silent?: boolean } = {}): Card {
    if (card.name === 'Insane Outcast') {
      card.moveTo(this.zones.byId('outcast'))
    }
    else {
      card.moveTo(this.zones.byPlayer(player, 'innerCircle'))
    }

    if (!opts.silent) {
      this.log.add({
        template: '{player} promotes {card}',
        args: { player, card }
      })
    }
    return card
  }

  aPromoteTopCard(player: Player): void {
    const deck = this.zones.byPlayer(player, 'deck')

    if (deck.cardlist().length === 0) {
      // See if we can reshuffle.
      const discard = this.zones.byPlayer(player, 'discard')
      if (discard.cardlist().length > 0) {
        this.mReshuffleDiscard(player)
      }

      // If not, do nothing.
      else {
        this.log.add({
          template: '{player} has no cards in deck or discard pile',
          args: { player }
        })
        return
      }
    }

    this.log.add({ template: 'Promoting top card of deck' })
    this.log.indent()
    this.aPromote(player, deck.peek() as unknown as Card)
    this.log.outdent()
  }

  aRecruit(player: Player, cardName: string, opts: { noCost?: boolean } = {}): void {
    let card: Card | undefined

    if (cardName.startsWith('devoured: ')) {
      card = ((this.zones.byId('devoured') as TyrantsZoneType).cardlist() as unknown as Card[]).slice(-1)[0]
    }
    else if (cardName === 'Priestess of Lolth') {
      card = (this.zones.byId('priestess') as TyrantsZoneType).peek() as Card | undefined
    }
    else if (cardName === 'House Guard') {
      card = (this.zones.byId('guard') as TyrantsZoneType).peek() as Card | undefined
    }
    else if (cardName === 'Insane Outcast') {
      card = (this.zones.byId('outcast') as TyrantsZoneType).peek() as Card | undefined

      if (!card) {
        this.log.indent()
        this.log.add({ template: 'No more insane outcasts remaining' })
        this.log.outdent()
        return
      }
    }
    else {
      const market = (this.zones.byId('market') as TyrantsZoneType).cardlist() as unknown as Card[]
      card = market.find((c: Card) => c.name === cardName)
    }

    util.assert(!!card, `Unable to find card to recruit: ${cardName}`)

    card!.moveTo(this.zones.byPlayer(player, 'discard'))

    if (!opts.noCost) {
      player.incrementCounter('influence', -card!.cost)
    }

    this.log.add({
      template: '{player} recruits {card}',
      args: { player, card }
    })

    this.mRefillMarket()
  }

  // Player will draw one less card the next time they refill their hand.
  aReduceDraw(player: Player): void {
    player.incrementCounter('reduce-draw')
  }

  aReturnSpy(player: Player, loc: TyrantsMapZoneType, owner: Player): void {
    const spy = loc.getSpies(owner as any)[0] as unknown as TyrantsTokenType
    util.assert(!!spy, `No spy belonging to ${owner.name} at ${loc.name()}`)
    this.mReturn(spy)
    this.log.add({
      template: `{player} returns {card} from {zone}`,
      args: {
        player,
        card: spy,
        zone: loc,
      },
    })
  }

  aReturnASpyAnd(player: Player, fn: (game: Tyrants, player: Player, opts: { loc: TyrantsMapZoneType }) => void): void {
    // Choose a spy to return
    const locations = this
      .getLocationAll()
      .filter((loc: TyrantsMapZoneType) => loc.getSpies(player as any).length > 0)

    if (locations.length === 0) {
      this.log.add({
        template: '{player} has no spies to return',
        args: { player }
      })
    }

    const loc = this.aChooseLocation(player, locations, { min: 0, max: 1 })

    // If a spy was returned, execute fn
    if (loc) {
      const spy = loc.getSpies(player as any)[0] as unknown as TyrantsTokenType

      this.log.add({
        template: `{player} returns {card} from {zone}`,
        args: {
          player,
          card: spy,
          zone: loc,
        },
      })

      this.mReturn(spy)

      fn(this, player, { loc })
    }
    else {
      this.log.add({
        template: '{player} chooses not to return a spy',
        args: { player }
      })
    }
  }

  aReturnTroop(player: Player, loc: TyrantsMapZoneType, owner: Player | 'neutral'): void {
    const troop = loc.getTroops(owner as any)[0] as unknown as TyrantsTokenType
    util.assert(!!troop, `No troop belonging to ${typeof owner === 'string' ? owner : owner.name} at ${loc.name()}`)
    this.log.add({
      template: `{player} returns {card} from {zone}`,
      args: {
        player,
        card: troop,
        zone: loc,
      },
    })
    this.mReturn(troop)
  }

  aSupplant(player: Player, loc: TyrantsMapZoneType, owner: Player | 'neutral'): void {
    this.mAssassinate(player, loc, owner)
    this.mDeploy(player, loc)

    const ownerDisplay = owner ? owner : 'neutral'

    this.log.add({
      template: '{player1} supplants {player2} troop at {loc}',
      args: {
        player1: player,
        player2: ownerDisplay,
        loc
      }
    })
  }

  aWithFocus(player: Player, test: (card: Card) => boolean, fn: () => void): void {
    const played = this.cards.byPlayer(player, 'played')
    const playedAspect = played
      .filter((card: Card) => test(card))
      .length > 1

    if (playedAspect) {
      this.log.add({
        template: '{player} has already played a matching focus card',
        args: { player }
      })
      fn()
      return
    }

    const inHand = this.cards.byPlayer(player, 'hand')
    const inHandAspect = inHand
      .filter((card: Card) => test(card))
      .length > 0

    if (inHandAspect) {
      this.log.add({
        template: '{player} has matching focus card in hand',
        args: { player },
      })
      fn()
      return
    }

    this.log.add({
      template: 'No card matching focus card',
    })
  }

  aWithFocusAspect(player: Player, aspect: string, fn: () => void): void {
    const test = (card: Card): boolean => card.aspect === aspect
    this.aWithFocus(player, test, fn)
  }

  aWithFocusInsaneOutcast(player: Player, fn: () => void): void {
    const test = (card: Card): boolean => card.name === 'Insane Outcast'
    this.aWithFocus(player, test, fn)
  }

  getAssassinateChoices(player: Player, opts: { loc?: TyrantsMapZoneType; whiteOnly?: boolean } = {}): string[] {
    const presence = opts.loc ? [opts.loc] : this.getPresence(player)

    const troops = presence
      .filter((loc: TyrantsMapZoneType) => opts.loc ? loc === opts.loc : true)
      .flatMap((loc: TyrantsMapZoneType) => (loc.getTroops() as unknown as TyrantsTokenType[]).map((troop) => [loc, troop] as [TyrantsMapZoneType, TyrantsTokenType]))
      .filter(([, troop]) => troop.owner !== (player as any))
      .filter(([, troop]) => opts.whiteOnly ? !troop.owner : true)
      .map(([loc, troop]) => `${loc.name()}, ${troop.getOwnerName()}`)
    const choices = util.array.distinct(troops).sort()
    return choices
  }

  getCardById(cardId: string): Card {
    // TODO: deprecate
    return this.cards.byId(cardId)
  }

  getControlMarkers(player?: Player): ControlMarker[] {
    const markers = this
      .getLocationAll()
      .map((loc: TyrantsMapZoneType) => loc.getControlMarker())
      .filter((marker) => Boolean(marker)) as ControlMarker[]

    if (player) {
      return markers.filter((marker: ControlMarker) => marker.ownerName === player.name)
    }
    else {
      return markers
    }
  }

  getDeployChoices(player: Player, opts: { anywhere?: boolean } = {}): TyrantsMapZoneType[] {
    const base = opts.anywhere ? this.getLocationAll() : this.getPresence(player)
    return base.filter((loc: TyrantsMapZoneType) => loc.getTroops().length < loc.size)
  }

  getExpansionList(): string[] {
    return this.settings.expansions
  }

  getLocationAll(): TyrantsMapZoneType[] {
    return this.zones.all().filter((z: TyrantsZoneType | TyrantsMapZoneType) => z.id.startsWith('map.')) as TyrantsMapZoneType[]
  }

  getLocationNeighbors(loc: TyrantsMapZoneType): TyrantsMapZoneType[] {
    return loc
      .neighborNames
      .map((name: string) => this.getLocationByName(name))
      .filter((neighbor: TyrantsMapZoneType | undefined) => Boolean(neighbor)) as TyrantsMapZoneType[]
  }

  getLocationByName(name: string): TyrantsMapZoneType {
    // TODO: deprecate
    const id = `map.${name}`
    return this.zones.byId(id) as TyrantsMapZoneType
  }

  getLocationsByPresence(player: Player): TyrantsMapZoneType[] {
    return this
      .getLocationAll()
      .filter((loc: TyrantsMapZoneType) => loc.chechHasPresence(player as any))
  }

  getPresence(player: Player): TyrantsMapZoneType[] {
    return this
      .getLocationAll()
      .filter((loc: TyrantsMapZoneType) => loc.presence.includes(player as any))
  }

  getRound(): number {
    return Math.floor(this.state.turn / this.players.all().length) + 1
  }

  getScore(player: Player): number {
    return this.getScoreBreakdown(player).total
  }

  getScoreBreakdown(player: Player): ScoreBreakdown {
    const self = this

    const summary: ScoreBreakdown = {
      "deck": [
        ...self.cards.byPlayer(player, 'hand'),
        ...self.cards.byPlayer(player, 'discard'),
        ...self.cards.byPlayer(player, 'deck'),
        ...self.cards.byPlayer(player, 'played'),
      ].map((card: Card) => card.points)
        .reduce((a: number, b: number) => a + b, 0),

      "inner circle": self
        .cards.byPlayer(player, 'innerCircle')
        .map((card: Card) => card.innerPoints)
        .reduce((a: number, b: number) => a + b, 0),

      "trophy hall": self.cards.byPlayer(player, 'trophyHall').length,

      "control": self
        .getLocationAll()
        .filter((loc: TyrantsMapZoneType) => loc.getController() === (player as any))
        .map((loc: TyrantsMapZoneType) => loc.points)
        .reduce((a: number, b: number) => a + b, 0),

      "total control": self
        .getLocationAll()
        .filter((loc: TyrantsMapZoneType) => loc.getTotalController() === (player as any))
        .length * 2,

      "victory points": player.getCounter('points'),

      total: 0
    }

    summary.total = (
      + summary['deck']
      + summary['inner circle']
      + summary['trophy hall']
      + summary['control']
      + summary['total control']
      + summary['victory points']
    )

    return summary
  }

  mAdjustCardVisibility(card: Card): void {
    if (!this.state.initializationComplete) {
      return
    }

    const zone = card.zone

    // Forget everything about a card if it is returned.
    if ((zone.kind() as string) === 'hidden') {
      card.visibility = []
    }

    else if ((zone.kind() as string) === 'public' || (zone.kind() as string) === 'location') {
      card.visibility = this.players.all()
    }

    else if (zone.kind() === 'private') {
      util.array.pushUnique(card.visibility, (zone as TyrantsZoneType).owner)
    }

    else {
      throw new Error(`Unknown zone kind ${zone.kind()} for zone ${zone.id}`)
    }
  }

  mAdjustControlMarkerOwnership(previous: ControlMarker[]): void {
    const markers = this.getControlMarkers()
    for (const marker of markers) {
      const prev = previous.find((p: ControlMarker) => p.locName === marker.locName)!

      if (prev.ownerName !== '' && marker.ownerName === '') {
        const player = this.players.byName(prev.ownerName)
        const loc = this.getLocationByName(marker.locName)

        this.log.add({
          template: '{player} loses the {loc} control marker',
          args: { player, loc }
        })
      }

      else if (prev.ownerName !== marker.ownerName) {
        const player = this.players.byName(marker.ownerName)
        const loc = this.getLocationByName(marker.locName)

        this.log.add({
          template: '{player} claims the {loc} control marker',
          args: { player, loc }
        })

        if (this.players.current() === player && !this._checkDoingSetup()) {
          player.incrementCounter('influence', marker.influence)
        }
      }

      else if (!prev.total && marker.total) {
        const player = this.players.byName(marker.ownerName)
        const loc = this.getLocationByName(marker.locName)

        this.log.add({
          template: '{player} converts the {loc} control marker to total control',
          args: { player, loc }
        })
      }
    }
  }

  mAdjustPresence(source: TyrantsZoneType | TyrantsMapZoneType, target: TyrantsZoneType | TyrantsMapZoneType, card: Card): void {
    if (card.isSpy || card.isTroop) {
      const toUpdate: TyrantsMapZoneType[] = []

      for (const zone of [source, target]) {
        if ((zone.kind() as string) === 'location') {
          toUpdate.push(zone as TyrantsMapZoneType)
          this.getLocationNeighbors(zone as TyrantsMapZoneType).forEach((loc: TyrantsMapZoneType) => util.array.pushUnique(toUpdate, loc))
        }
      }

      toUpdate
        .forEach((loc: TyrantsMapZoneType) => this.mCalculatePresence(loc))
    }
  }

  mAssassinate(player: Player, loc: TyrantsMapZoneType, owner: Player | 'neutral'): TyrantsTokenType {
    const target = loc.getTroops(owner as any)[0] as unknown as TyrantsTokenType

    util.assert(!!target, 'No valid target for owner at location')

    ;(target as any).moveTo(this.zones.byPlayer(player, 'trophyHall'))
    return target
  }

  mCalculatePresence(location: TyrantsMapZoneType): void {
    util.assert((location.kind() as string) === 'location')

    const relevantTroops = [
      location,
      ...this.getLocationNeighbors(location)
    ]

    const playersByTroop = relevantTroops
      .flatMap((loc: TyrantsMapZoneType) => loc.getTroops() as unknown as TyrantsTokenType[])
      .map((card) => this.players.byOwner(card as any))
      .filter((player: Player | undefined) => Boolean(player)) as Player[]

    const playersBySpy = (location.getSpies() as unknown as TyrantsTokenType[])
      .map((card) => this.players.byOwner(card as any))
      .filter((player: Player | undefined) => Boolean(player)) as Player[]

    location.presence = util.array.distinct([...playersByTroop, ...playersBySpy])
  }

  mCheckZoneLimits(zone: TyrantsZoneType | TyrantsMapZoneType): void {
    if ((zone.kind() as string) === 'location') {
      const mapZone = zone as TyrantsMapZoneType
      util.assert(mapZone.getTroops().length <= mapZone.size, `Too many troops in ${zone.id}`)

      const spies = mapZone.getSpies() as unknown as TyrantsTokenType[]
      const uniqueSpies = util.array.distinct(spies.map((spy) => spy.owner!.name))
      util.assert(spies.length === uniqueSpies.length, `More than one spy per player at ${zone.id}`)
    }
  }

  mDeploy(player: Player, loc: TyrantsMapZoneType, opts: DeployOpts = {}): TyrantsTokenType {
    const troop = (opts.troop || this.cards.byPlayer(player, 'troops')[0]) as TyrantsTokenType
    ;(troop as any).moveTo(loc)
    return troop
  }

  mDevour(card: Card): void {
    if (card.name === 'Insane Outcast') {
      card.moveTo(this.zones.byId('outcast'))
    }
    else {
      card.moveTo(this.zones.byId('devoured'))
    }
  }

  mExecuteCard(player: Player, card: Card): void {
    this.log.indent()
    card.impl(this, player, { card })
    this.log.outdent()
  }

  mPlaceSpy(player: Player, loc: TyrantsMapZoneType): void {
    const spy = this.cards.byPlayer(player, 'spies')[0]
    spy.moveTo(loc)
  }

  mReshuffleDiscard(player: Player): void {
    const discard = this.zones.byPlayer(player, 'discard')
    const deck = this.zones.byPlayer(player, 'deck')

    util.assert(discard.cardlist().length > 0, 'Cannot reshuffle empty discard.')
    util.assert(deck.cardlist().length === 0, 'Cannot reshuffle discard when deck is not empty.')

    this.log.add({
      template: '{player} shuffles their discard into their deck',
      args: { player }
    })
    this.log.indent()
    this.log.add({
      template: '{count} cards reshuffled',
      args: {
        count: discard.cardlist().length
      }
    })
    this.log.outdent()

    for (const card of discard.cardlist()) {
      card.moveTo(deck)
    }

    this.mShuffle(deck)
  }

  mReturn(item: TyrantsTokenType): void {
    item.moveTo(item.home!)
  }

  mShuffle(zone: TyrantsZoneType): void {
    util.array.shuffle(zone._cards, this.random)
  }

  mRefillHand(player: Player): void {
    const deck = this.zones.byPlayer(player, 'deck')
    const hand = this.zones.byPlayer(player, 'hand')

    this.log.add({
      template: '{player} will refill their hand',
      args: { player }
    })
    this.log.indent()

    const reduceDraw = player.getCounter('reduce-draw')
    const numberToDraw = 5 - reduceDraw

    if (reduceDraw > 0) {
      this.log.add({
        template: '{player} will draw {count} fewer cards this round',
        args: { player, count: reduceDraw }
      })
      player.setCounter('reduce-draw', 0)
    }

    const drawnAfterShuffle = Math.min(
      Math.max(0, numberToDraw - deck.cardlist().length),  // Number of cards left to draw after reshuffling
      this.cards.byPlayer(player, 'discard').length  // Number of cards in discard pile
    )

    if (deck.cardlist().length < numberToDraw) {
      this.log.add({
        template: '{player} draws the remaining {count} cards from deck',
        args: {
          player,
          count: deck.cardlist().length
        }
      })
    }

    while (hand.cardlist().length < numberToDraw) {
      const drawResult = this.aDraw(player, { silent: true })
      if (drawResult === 'no-more-cards') {
        break
      }
    }

    if (drawnAfterShuffle) {
      this.log.add({
        template: '{player} draws an additional {count} cards',
        args: {
          player,
          count: drawnAfterShuffle
        }
      })
    }

    this.log.outdent()
  }

  mRefillMarket(quiet: boolean = false): void {
    const deck = this.zones.byId('marketDeck') as TyrantsZoneType
    const market = this.zones.byId('market') as TyrantsZoneType
    const count = 6 - market.cardlist().length

    for (let i = 0; i < count; i++) {
      const card = deck.peek()

      if (!card) {
        this.log.add({ template: 'The market deck is empty' })
        return
      }

      if (!quiet) {
        this.log.add({
          template: '{card} added to the market',
          args: { card }
        })
      }

      card.moveTo(market)
    }
  }

  mSetGhostFlag(): void {
    this.state.ghostFlag = true
  }

  _checkDoingSetup(): boolean {
    return this.doingSetup
  }
}

import util from '../lib/util.js'

function TyrantsFactory(settings: Settings, viewerName: string): Tyrants {
  const data = GameFactory(settings)
  return new Tyrants(data.serialize(), viewerName)
}

function factoryFromLobby(lobby: Lobby): unknown {
  return GameFactory({
    game: 'Tyrants of the Underdark',
    name: lobby.name,
    expansions: lobby.options.expansions,
    map: lobby.options.map,
    menzoExtraNeutral: lobby.options.menzoExtraNeutral,
    players: lobby.users,
    seed: lobby.seed,
    chooseColors: true,
  })
}

export {
  GameOverEvent,
  Tyrants,
  TyrantsFactory,
  factoryFromLobby as factory,
  res,
}

export type { Player, Card, ControlMarker, Settings, ScoreBreakdown }
