import {
  Game,
  GameFactory,
  GameOverEvent,
} from '../lib/game.js'
import res from './res/index.js'
import selector from '../lib/selector.js'
import util from '../lib/util.js'

import { UltimateLogManager } from './UltimateLogManager.js'
import { UltimateActionManager } from './UltimateActionManager.js'
import { UltimateCardManager } from './UltimateCardManager.js'
import { UltimatePlayerManager } from './UltimatePlayerManager.js'
import { UltimateUtils } from './UltimateUtils.js'
import { UltimateZone } from './UltimateZone.js'
import { UltimateZoneManager } from './UltimateZoneManager.js'

import { getDogmaShareInfo } from './actions/Dogma.js'

import type { UltimatePlayer, BiscuitCounts } from './UltimatePlayer.js'
import type { DogmaInfo } from './actions/Dogma.js'

const SUPPORTED_EXPANSIONS = ['base', 'echo', 'figs', 'city', 'arti', 'usee']

interface Card {
  id: string
  name: string
  age: number
  color: string
  expansion: string
  zone: Zone
  owner: UltimatePlayer | null
  visibility: string[]
  biscuits: string
  dogmaBiscuit: string
  dogma: string[]
  text?: string
  isSpecialAchievement?: boolean
  isDecree?: boolean
  isMuseum?: boolean
  visibleAge?: number
  moveTo(zone: Zone | string, position?: number): Card
  moveHome(): void
  reveal(): void
  getAge(): number
  getHiddenName(): string
  checkHasBiscuit(biscuit: string): boolean
  checkIsCity(): boolean
  checkIsFigure(): boolean
  checkBiscuitIsVisible(biscuit: string): boolean
  checkPlayerIsEligible?(game: Innovation, player: UltimatePlayer, reduceCost: boolean): boolean
  visibleBiscuits(): string
  visibleEffects(kind: string, opts?: { selfExecutor?: boolean }): VisibleEffectsResult | undefined
  getBonuses(): number[]
  getKarmaInfo(trigger: string): KarmaInfo[]
  decreeImpl?(game: Innovation, player: UltimatePlayer): void
}

interface Zone {
  id: string
  color?: string
  splay?: string
  owner?: UltimatePlayer
  _cards: Card[]
  cardlist(): Card[]
  peek(): Card | null
  shuffle(): void
  initializeCards(cards: Card[]): void
  name(): string
  kind(): string
  numVisibleCards(): number
}

interface UltimateUtilsInterface {
  colors(): string[]
  biscuitNames(): string[]
  biscuitNameToIcon(name: string): string
  highestCards(cards: Card[], opts?: { visible?: boolean }): Card[]
  lowestCards(cards: Card[]): Card[]
  emptyBiscuits(): BiscuitCounts
  combineBiscuits(left: BiscuitCounts, right: BiscuitCounts): BiscuitCounts
  serializeObject(obj: unknown): string
  separateByAge(cards: Card[]): Record<number, Card[]>
  colorToDecree(color: string): string
}

interface ZoneManager {
  register(zone: Zone): void
  byId(id: string): Zone
  byDeck(exp: string, age: number): Zone
  byPlayer(player: UltimatePlayer, zone: string): Zone
  colorStacks(player: UltimatePlayer): Zone[]
}

interface CardManager {
  byId(id: string): Card
  byZone(zone: string): Card[]
  byPlayer(player: UltimatePlayer, zone: string): Card[]
  byDeck(exp: string, age: number): Card[]
  byExp(exp: string): ExpansionData
  tops(player: UltimatePlayer): Card[]
  top(player: UltimatePlayer, color: string): Card | undefined
  registerExpansion(exp: string, data: ExpansionData): void
}

interface PlayerManager {
  all(): UltimatePlayer[]
  other(player: UltimatePlayer): UltimatePlayer[]
  current(): UltimatePlayer
  opponents(player: UltimatePlayer): UltimatePlayer[]
  startingWith(player: UltimatePlayer): UltimatePlayer[]
  startingWithCurrent(): UltimatePlayer[]
  endingWith(player: UltimatePlayer): UltimatePlayer[]
  byName(name: string): UltimatePlayer
  byOwner(card: Card): UltimatePlayer | null
  byZone(zone: Zone): UltimatePlayer | null
  advancePlayer(): void
  passToPlayer(player: UltimatePlayer): void
}

interface Log {
  add(entry: { template: string; classes?: string[]; args?: Record<string, unknown> }): void
  addNoEffect(): void
  addDoNothing(player: UltimatePlayer): void
  indent(): void
  outdent(): void
  getLog(): LogEntry[]
}

interface LogEntry {
  template: string
  args?: Record<string, unknown>
}

interface KarmaImpl {
  trigger: string | string[]
  kind?: string
  reason?: string
  decree?: string
  triggerAll?: boolean
  func?: (game: Innovation, player: UltimatePlayer, opts?: Record<string, unknown>) => unknown
  matches?: (game: Innovation, player: UltimatePlayer, opts?: Record<string, unknown>) => boolean
}

interface KarmaInfo {
  card: Card
  index: number
  text: string
  impl: KarmaImpl
  owner?: UltimatePlayer | null
}

interface VisibleEffectsResult {
  card: Card
  texts: string[]
  impls: Array<(game: unknown, player: UltimatePlayer) => void>
}

interface GameState {
  initializationComplete: boolean
  firstPicksComplete: boolean
  dogmaInfo: DogmaInfo & {
    effectLeader?: UltimatePlayer
    globalAgeIncrease?: number
    chainRule?: Record<string, { cardName?: string }>
  }
  wouldWinKarma: boolean
  scoreCount: Record<string, number>
  tuckCount: Record<string, number>
  tuckedGreenForPele: UltimatePlayer[]
  didEndorse: boolean
  useAgeZero: boolean
  turn: number
  round: number
  karmaDepth: number
  actionNumber: number | null
  drawInfo: Record<string, { drewFirstBaseCard: boolean }>
}

interface GameSettings {
  version: number
  expansions: string[]
  randomizeExpansions?: boolean
  teams?: boolean
}

interface GameStats {
  melded: string[]
  meldedBy: Record<string, string>
  highestMelded: number
  firstToMeldOfAge: [number, string][]
  dogmaActions: Record<string, number>
}

interface ExpansionData {
  cards: Card[]
  achievements: Card[]
  byAge: Record<number, Card[]>
}

interface ActionManager {
  draw(player: UltimatePlayer, opts?: Record<string, unknown>): Card
  meld(player: UltimatePlayer, card: Card, opts?: Record<string, unknown>): Card
  dogma(player: UltimatePlayer, card: Card, opts?: Record<string, unknown>): void
  achieveAction(player: UltimatePlayer, arg: string, opts?: Record<string, unknown>): void
  auspice(player: UltimatePlayer, card: Card): void
  endorse(player: UltimatePlayer, color: string): void
  rotate(player: UltimatePlayer, card: Card): void
  claimAchievement(player: UltimatePlayer, opts: Record<string, unknown>): void
  junkMany(player: UltimatePlayer, cards: Card[], opts?: Record<string, unknown>): void
  chooseCard(player: UltimatePlayer, cards: Card[], opts?: Record<string, unknown>): Card
  acted(player: UltimatePlayer): void
  score(player: UltimatePlayer, card: Card): void
}

interface InputRequest {
  actor: string
  title: string
  choices: unknown[]
}

interface InputResponse {
  actor: string
  selection: string[]
}

interface Lobby {
  name: string
  seed: string
  users: unknown[]
  options: {
    expansions: string[]
    randomizeExpansions?: boolean
  }
}

interface AchievementDetails {
  standard: Card[]
  special: Card[]
  other: Card[]
  total: number
}

interface ScoreDetails {
  score: number[]
  bonuses: number[]
  karma: { name: string; points: number }[]
  scorePoints: number
  bonusPoints: number
  karmaPoints: number
  total: number
}

class Innovation extends Game {
  util!: UltimateUtilsInterface
  zones!: ZoneManager
  cards!: CardManager
  players!: PlayerManager
  actions!: ActionManager
  log!: Log
  state!: GameState
  settings!: GameSettings
  stats!: GameStats
  getDogmaShareInfo!: (player: UltimatePlayer, card: Card) => { sharing: UltimatePlayer[]; demanding: UltimatePlayer[] }

  constructor(serialized_data: unknown, viewerName: string) {
    super(serialized_data, viewerName, {
      LogManager: UltimateLogManager,
      ActionManager: UltimateActionManager,
      CardManager: UltimateCardManager,
      PlayerManager: UltimatePlayerManager,
      ZoneManager: UltimateZoneManager,
    })

    this.util = new UltimateUtils(this)

    // Used in the UI for showing who will share/demand with an action
    this.getDogmaShareInfo = getDogmaShareInfo.bind(this.actions)
  }

  _mainProgram(): void {
    this.initialize()
    this.firstPicks()
    this.mainLoop()
  }

  _gameOver(event: { data: { player: UltimatePlayer } }): unknown {
    // Check for 'would-win' karmas.
    this.state.wouldWinKarma = true
    const result = this.aKarma(event.data.player, 'would-win', { event })
    this.state.wouldWinKarma = false

    if (result) {
      return result
    }

    return event
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Initialization

  initialize(): void {
    this.log.add({ template: 'Initializing' })
    this.log.indent()

    this.state.useAgeZero = false

    this.initializeCards()
    this.initializeExpansions()
    this.initializeTeams()
    this.initializeZones()
    this.initializeStartingCards()
    this.initializeTransientState()

    this.log.outdent()

    this.state.initializationComplete = true
    this._breakpoint('initialization-complete')
  }

  initializeCards(): void {
    const cardData = res.factory(this)

    for (const exp of res.ALL_EXPANSIONS) {
      this.cards.registerExpansion(exp, cardData[exp])
    }
  }

  initializeExpansions(): void {
    if (!this.settings.version || this.settings.version < 2) {
      return
    }


    if (this.settings.randomizeExpansions) {
      this.settings.expansions = ['base']

      const probability = .6
      this.log.add({
        template: 'Expansions will be randomly selected with probability {prob}.',
        args: { prob: probability },
      })

      const availableExpansions = SUPPORTED_EXPANSIONS.filter(exp => exp !== 'base')
      for (const exp of availableExpansions) {
        const randomNumber = this.random()
        const includeThisExpansion = randomNumber < probability
        this.log.add({
          template: '{expansion} rolled {number} {emoji}',
          args: {
            expansion: exp,
            number: randomNumber.toPrecision(2),
            emoji: includeThisExpansion ? '✅' : '❌',
          }
        })

        if (includeThisExpansion) {
          this.settings.expansions.push(exp)
        }
      }
    }

    this.log.add({
      template: 'The following expansions were selected: {expansions}',
      args: { expansions: this.settings.expansions.join() },
    })
  }

  initializeTransientState(): void {
    this.mResetDogmaInfo()
    this.mResetPeleCount()
    this.mResetDrawInfo()
    this.state.turn = 1
    this.state.round = 1
    this.state.karmaDepth = 0
    this.state.actionNumber = null
    this.state.wouldWinKarma = false
    this.state.didEndorse = false
    this.state.tuckCount = Object.fromEntries(this.players.all().map((p: UltimatePlayer) => [p.name, 0]))
    this.state.scoreCount = Object.fromEntries(this.players.all().map((p: UltimatePlayer) => [p.name, 0]))
    this.stats = {
      melded: [],
      meldedBy: {},
      highestMelded: 1,
      firstToMeldOfAge: [],
      dogmaActions: {},
    }
  }

  initializeTeams(): void {
    const players = this.players.all()
    let teamMod = players.length
    if (this.settings.teams) {
      util.assert(this.players.all().length === 4, 'Teams only supported with 4 players')
      teamMod = 2
    }
    for (let i = 0; i < players.length; i++) {
      const teamNumber = i % teamMod
      ;(players[i] as UltimatePlayer & { team: string }).team = `team${teamNumber}`
    }
  }

  initializeZones(): void {
    this.initializeZonesDecks()
    this.initializeZonesAchievements()
    this.initializeZonesPlayers()
    this.zones.register(new UltimateZone(this, 'junk', 'junk', 'hidden'))
  }

  initializeZonesDecks(): void {
    for (const exp of SUPPORTED_EXPANSIONS) {
      for (const [age, cards] of Object.entries(this.cards.byExp(exp).byAge)) {
        if (!cards) {
          throw new Error(`Missing cards for ${exp}-${age}`)
        }
        else if (!Array.isArray(cards)) {
          throw new Error(`Cards for ${exp}-${age} is of type ${typeof cards}`)
        }

        const id = `decks.${exp}.${age}`
        const zone = new UltimateZone(this, id, id, 'hidden')
        zone.initializeCards(cards)
        zone.shuffle()
        this.zones.register(zone)
      }
    }
  }

  initializeZonesAchievements(): void {
    const achZone = new UltimateZone(this, 'achievements', 'achievements', 'hidden')
    this.zones.register(achZone)

    // Special achievements
    const specialAchievements: Card[] = []
    for (const exp of SUPPORTED_EXPANSIONS) {
      if (this.getExpansionList().includes(exp)) {
        for (const ach of this.cards.byExp(exp).achievements) {
          specialAchievements.push(ach)
        }
      }
    }
    achZone.initializeCards(specialAchievements)

    // Standard achievements
    // These are just moved to the achievements zone because their home will remain as their original
    // decks. If, for some reason, they are 'returned', they will go back to their decks, not to the
    // achievements.
    for (const age of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      const ageZone = this.zones.byDeck('base', age)
      ageZone.peek()!.moveTo(achZone)
    }
  }

  initializeZonesPlayers(): void {
    const self = this

    const _addPlayerZone = function(player: UltimatePlayer, name: string, kind: string): void {
      const id = `players.${player.name}.${name}`
      const zone = new UltimateZone(self, id, id, kind, player)
      self.zones.register(zone)
    }

    for (const player of this.players.all()) {
      _addPlayerZone(player, 'hand', 'private')
      _addPlayerZone(player, 'score', 'private')
      _addPlayerZone(player, 'forecast', 'private')
      _addPlayerZone(player, 'achievements', 'hidden')
      _addPlayerZone(player, 'red', 'public')
      _addPlayerZone(player, 'blue', 'public')
      _addPlayerZone(player, 'green', 'public')
      _addPlayerZone(player, 'yellow', 'public')
      _addPlayerZone(player, 'purple', 'public')
      _addPlayerZone(player, 'artifact', 'public')
      _addPlayerZone(player, 'museum', 'public')
      _addPlayerZone(player, 'safe', 'hidden')

      for (const color of this.util.colors()) {
        const zone = this.zones.byPlayer(player, color)
        zone.color = color
        zone.splay = 'none'
      }
    }
  }

  initializeStartingCards(): void {
    for (const player of this.players.all()) {
      this.actions.draw(player, { exp: 'base', age: 1 })
      if (this.settings.version < 3 && this.getExpansionList().includes('echo')) {
        this.actions.draw(player, { exp: 'echo', age: 1 })
      }
      else {
        this.actions.draw(player, { exp: 'base', age: 1 })
      }
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Primary game logic

  firstPicks(): void {
    this.log.add({ template: 'Choosing starting cards' })
    this.log.indent()
    const requests = this
      .players.all()
      .map((p: UltimatePlayer) => ({
        actor: this.util.serializeObject(p),
        title: 'Choose First Card',
        choices: this.zones.byPlayer(p, 'hand').cardlist().map(this.util.serializeObject),
      }))

    const picks = this
      .requestInputMany(requests)
      .map((resp: InputResponse) => [
        this.players.byName(resp.actor),
        this.cards.byId(resp.selection[0])
      ])
      .sort((l: [UltimatePlayer, Card], r: [UltimatePlayer, Card]) => l[1].name.localeCompare(r[1].name))
    for (const [player, card] of picks) {
      this.actions.meld(player, card)
    }

    this.players.passToPlayer(picks[0][0])

    this.log.outdent()

    this.state.firstPicksComplete = true

    this._breakpoint('before-first-player')
  }

  mainLoop(): void {
    while (true) {
      this.log.add({
        template: "{player}'s turn {count}",
        classes: ['player-turn-start'],
        args: {
          player: this.players.current(),
          count: this.state.round,
        }
      })

      this.artifact()
      this.mAchievementCheck()

      this.action(1)
      this.mAchievementCheck()

      this.action(2)
      this.mAchievementCheck()

      this.endTurn()
    }
  }

  artifact(): void {
    const player = this.players.current()
    const artifact = this.zones.byPlayer(player, 'artifact').cardlist()[0]
    if (artifact) {
      this.log.add({
        template: 'Free Artifact Action',
      })
      this.log.indent()

      const action = this.requestInputSingle({
        actor: player.name,
        title: 'Free Artifact Action',
        choices: ['dogma', 'skip']
      })[0]

      switch (action) {
        case 'dogma': {
          this.actions.dogma(player, artifact, { artifact: true })
          this.actions.rotate(player, artifact)
          this.fadeFiguresCheck()
          break
        }

        case 'skip':
          this.log.add({
            template: '{player} skips the free artifact action',
            classes: ['action-header'],
            args: { player },
          })
          this.actions.rotate(player, artifact)
          break
        default:
          throw new Error(`Unknown artifact action: ${action}`)
      }

      this.log.outdent()
    }
  }

  action(count: number): void {
    const player = this.players.current()

    this.state.actionNumber = count

    // The first player (or two) only gets one action
    const numFirstPlayers = this.players.all().length >= 4 ? 2 : 1
    if (this.state.turn <= numFirstPlayers) {
      if (count === 1) {
        this.log.add({
          template: '{player} gets only 1 action for the first round',
          args: { player }
        })
      }
      else if (count === 2) {
        return
      }
    }

    const countTerm = count === 1 ? 'First' : 'Second'
    this.log.add({
      template: `${countTerm} action`,
      classes: ['action-header'],
    })
    this.log.indent()

    const inputRequest = {
      actor: player.name,
      title: `Choose ${countTerm} Action`,
      choices: this._generateActionChoices(),
    }
    const chosenAction = this.requestInputSingle(inputRequest)[0] as { title: string; selection: string[] }

    const validationResult = selector.validate(inputRequest, {
      title: inputRequest.title,
      selection: [chosenAction]
    })

    if (!validationResult.valid) {
      throw new Error(validationResult.mismatch)
    }

    if (!chosenAction.selection) {
      console.log(chosenAction)
      throw new Error('Invalid selection')
    }

    const name = chosenAction.title
    const arg = chosenAction.selection[0]

    if (name === 'Achieve') {
      this.actions.achieveAction(player, arg)
    }
    else if (name === 'Auspice') {
      const card = this.cards.byId(arg)
      this.actions.auspice(player, card)
    }
    else if (name === 'Decree') {
      this.aDecree(player, arg)
    }
    else if (name === 'Dogma') {
      const card = this.cards.byId(arg)
      this.actions.dogma(player, card)
    }
    else if (name === 'Draw') {
      this.actions.draw(player, { isAction: true })
    }
    else if (name === 'Endorse') {
      this.actions.endorse(player, arg)
    }
    else if (name === 'Meld') {
      const card = this.cards.byId(arg)
      this.actions.meld(player, card, { asAction: true })
    }
    else {
      throw new Error(`Unhandled action type ${name}`)
    }

    this.log.outdent()

    this.fadeFiguresCheck()
    this.mResetDogmaInfo()
  }

  fadeFiguresCheck(): void {
    for (const player of this.players.all()) {
      const topFiguresFn = () => this
        .cards.tops(player)
        .filter((card: Card) => card.checkIsFigure())

      if (topFiguresFn().length > 1) {
        this.log.add({
          template: '{player} has {count} figures and must fade some',
          args: { player, count: topFiguresFn().length }
        })
        this.log.indent()

        while (topFiguresFn().length > 1) {
          const karmaInfos = this.getInfoByKarmaTrigger(player, 'no-fade')
          if (karmaInfos.length > 0) {
            this.log.add({
              template: '{player} fades nothing due to {card}',
              args: { player, card: karmaInfos[0].card }
            })
            break
          }

          const toFade = this.actions.chooseCard(player, topFiguresFn())
          this.actions.score(player, toFade)
        }

        this.log.outdent()
      }
    }
  }

  endTurn(): void {
    const players = this.players.all()

    // Set next player
    this.players.advancePlayer()

    // Track number of turns
    this.state.turn += 1
    this.state.round = Math.floor((this.state.turn + players.length - 1) / players.length)

    // Reset various turn-centric state
    this.state.actionNumber = null
    this.state.didEndorse = false
    this.state.tuckCount = Object.fromEntries(this.players.all().map((p: UltimatePlayer) => [p.name, 0]))
    this.state.scoreCount = Object.fromEntries(this.players.all().map((p: UltimatePlayer) => [p.name, 0]))
    this.mResetDogmaInfo()
    this.mResetPeleCount()
    this.mResetDrawInfo()
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Actions

  aCardEffect(player: UltimatePlayer, info: KarmaInfo, opts: Record<string, unknown> = {}): unknown {
    const prevLeader = this.state.dogmaInfo.effectLeader
    if (opts.leader) {
      this.state.dogmaInfo.effectLeader = opts.leader as UltimatePlayer
    }

    const fn = typeof info.impl === 'function' ? info.impl : info.impl.func!
    const result = fn(this, player, { self: info.card, ...opts })

    if (opts.leader) {
      this.state.dogmaInfo.effectLeader = prevLeader
    }

    return result
  }

  aOneEffect(
    player: UltimatePlayer,
    card: Card,
    text: string,
    impl: (game: Innovation, player: UltimatePlayer) => void,
    opts: {
      sharing?: UltimatePlayer[]
      demanding?: UltimatePlayer[]
      leader?: UltimatePlayer
      endorsed?: boolean
      foreseen?: boolean
      noShare?: boolean
    } = {},
  ): void {

    // Default opts
    opts = Object.assign({
      sharing: [],
      demanding: [],
      leader: player,
      endorsed: false,
      foreseen: false,
    }, opts)

    const repeatCount = opts.endorsed ? 2 : 1

    const actors = [player]
      .concat(opts.sharing!)
      .concat(opts.demanding!)

    const actorsOrdered = this
      .players
      .endingWith(player)
      .filter((player: UltimatePlayer) => actors.some(actor => actor.id === player.id))

    for (const actor of actorsOrdered) {
      this.state.dogmaInfo.acting = actor

      for (let z = 0; z < repeatCount; z++) {

        const isDemand = text.toLowerCase().startsWith('i demand')
        const isCompel = text.toLowerCase().startsWith('i compel')

        const demand = isDemand && opts.demanding!.some(target => target.id === actor.id)
        const compel = isCompel && opts.sharing!.some(target => target.id === actor.id) && actor !== player
        const share = !isDemand && !isCompel && !opts.noShare && opts.sharing!.some(target => target.id === actor.id) && z === 0
        const owner = !isDemand && !isCompel && actor.id === player.id

        if (compel || demand || share || owner) {
          this.log.add({
            template: `{player}, {card}: ${text}`,
            classes: ['card-effect'],
            args: { player: actor, card }
          })
          this.log.indent()

          const effectInfo: KarmaInfo = {
            card,
            text,
            impl: impl as unknown as KarmaImpl,
            index: 0,
          }

          if (demand || compel) {
            this.state.dogmaInfo.isDemandEffect = true

            const karmaKind = this.aKarma(actor, 'demand-success', {
              card,
              effectInfo,
              leader: opts.leader
            })
            if (karmaKind === 'would-instead') {
              this.state.dogmaInfo.isDemandEffect = false
              this.actions.acted(player)
              this.log.outdent()
              continue
            }
          }

          const dogmaEffectKarmaKind = this.aKarma(actor, 'dogma-effect', {
            ...opts,
            card,
            effect: function(this: { game: Innovation }) {
              this.game.aCardEffect(actor, effectInfo, {
                leader: opts.leader,
                self: card,
                foreseen: opts.foreseen,
              })
            }
          })
          if (dogmaEffectKarmaKind === 'would-instead') {
            this.acted(player)
            continue
          }

          this.aCardEffect(actor, effectInfo, {
            leader: opts.leader,
            self: card,
            foreseen: opts.foreseen,
          })

          if (demand || compel) {
            this.state.dogmaInfo.isDemandEffect = false
          }

          this.log.outdent()

          if (this.state.dogmaInfo.earlyTerminate) {
            this.log.add({
              template: 'Dogma action is complete'
            })
            this.state.dogmaInfo.acting = null
            return
          }
        }
      }
      this.state.dogmaInfo.acting = null
    }
  }

  aCardEffects(
    player: UltimatePlayer,
    card: Card,
    kind: string,
    opts: Record<string, unknown> = {}
  ): void {
    const effects = card.visibleEffects(kind, opts as { selfExecutor?: boolean })
    if (!effects) {
      return
    }

    const { texts, impls } = effects

    for (let i = 0; i < texts.length; i++) {
      this.aOneEffect(player, card, texts[i], impls[i] as (game: Innovation, player: UltimatePlayer) => void, opts as {
        sharing?: UltimatePlayer[]
        demanding?: UltimatePlayer[]
        leader?: UltimatePlayer
        endorsed?: boolean
        foreseen?: boolean
        noShare?: boolean
      })
      if (this.state.dogmaInfo.earlyTerminate) {
        return
      }
    }
  }

  aTrackChainRule(player: UltimatePlayer, card: Card): void {
    if (!this.state.dogmaInfo.chainRule) {
      this.state.dogmaInfo.chainRule = {}
    }
    if (!this.state.dogmaInfo.chainRule[player.name]) {
      this.state.dogmaInfo.chainRule[player.name] = {}
    }

    const data = this.state.dogmaInfo.chainRule[player.name]

    // This is the first card in a potential chain event.
    if (!data.cardName) {
      data.cardName = card.name
    }

    // A second card is calling self-execute. Award the chain achievement.
    else if (data.cardName !== card.name) {
      this.log.add({
        template: '{player} achieves a Chain Achievement because {card} is recursively self-executing',
        args: { player, card }
      })
      const achievement = this.zones.byDeck('base', 11).cardlist()[0]
      if (achievement) {
        this.actions.claimAchievement(player, { card: achievement })
      }
      else {
        this.log.add({ template: 'There are no cards left in the 11 deck to achieve.' })
      }
    }
  }

  aFinishChainEvent(player: UltimatePlayer, card: Card): void {
    const data = this.state.dogmaInfo.chainRule![player.name]

    // Got to the end of the dogma action for the original chain card.
    if (data.cardName === card.name) {
      delete this.state.dogmaInfo.chainRule![player.name]
    }

    // This card is finished, but some earlier card is still executing.
    else {
      // do nothing
    }
  }

  aSelfExecute(executingCard: Card, player: UltimatePlayer, card: Card, opts: Record<string, unknown> = {}): void {
    this.aTrackChainRule(player, executingCard)

    const topCard = this.cards.top(player, card.color)
    const isTopCard = topCard && topCard.name === card.name

    opts.selfExecutor = player

    this.log.add({
      template: '{player} will {kind}-execute {card}',
      args: {
        player,
        card,
        kind: (opts.superExecute ? 'super' : 'self'),
      }
    })

    // Do all visible echo effects in this color.
    if (isTopCard) {
      const cards = this
        .cards.byPlayer(player, card.color)
        .filter((other: Card) => other.id !== card.id)
        .reverse()
      for (const other of cards) {
        this.aCardEffects(player, other, 'echo', opts)
      }
    }

    // Do the card's echo effects.
    this.aCardEffects(player, card, 'echo', opts)

    // Do the card's dogma effects.
    if (opts.superExecute) {
      // Demand all opponents
      opts.demanding = this.players.opponents(player)
    }
    this.aCardEffects(player, card, 'dogma', opts)

    this.aFinishChainEvent(player, card)
  }

  aSuperExecute(executingCard: Card, player: UltimatePlayer, card: Card): void {
    this.aSelfExecute(executingCard, player, card, { superExecute: true })
  }

  aDecree(player: UltimatePlayer, name: string): void {
    const card = this.cards.byId(name)
    const hand = this.zones.byPlayer(player, 'hand')

    this.log.add({
      template: '{player} declares a {card} decree',
      args: { player, card }
    })
    this.log.indent()

    // Handle karma
    const karmaKind = this.aKarma(player, 'decree')
    if (karmaKind === 'would-instead') {
      this.actions.acted(player)
      return
    }

    this.actions.junkMany(player, hand.cardlist(), { ordered: true })

    let doImpl = false
    if (card.zone.id === 'achievements') {
      this.actions.claimAchievement(player, { card })
      doImpl = true
    }
    else if (card.zone.id === `players.${player.name}.achievements`) {
      doImpl = true
    }
    else {
      card.moveTo('achievements')
      this.log.add({
        template: '{player} returns {card} to the achievements',
        args: { player, card }
      })
    }

    if (doImpl) {
      this.log.add({
        template: '{card}: {text}',
        args: {
          card,
          text: card.text
        }
      })
      this.log.indent()
      card.decreeImpl!(this, player)
      this.log.outdent()
    }

    this.log.outdent()
  }

  aExchangeCards(player: UltimatePlayer, cards1: Card[], cards2: Card[], zone1: Zone, zone2: Zone): string | undefined {
    const karmaKind = this.aKarma(player, 'exchange', { cards1, cards2, zone1, zone2 })
    if (karmaKind === 'would-instead') {
      this.actions.acted(player)
      return 'would-instead'
    }

    this.log.add({
      template: '{player} exchanges {count1} cards for {count2} cards',
      args: {
        player,
        count1: cards1.length,
        count2: cards2.length,
      }
    })

    let acted = false

    for (const card of cards1) {
      acted = Boolean(card.moveTo(zone2)) || acted
    }
    for (const card of cards2) {
      acted = Boolean(card.moveTo(zone1)) || acted
    }

    if (acted) {
      this.actions.acted(player)
    }
  }

  aExchangeZones(player: UltimatePlayer, zone1: Zone, zone2: Zone): void {
    const cards1 = zone1.cardlist()
    const cards2 = zone2.cardlist()

    const result = this.aExchangeCards(player, cards1, cards2, zone1, zone2)

    if (result === 'would-instead') {
      return
    }

    this.log.add({
      template: '{player} exchanges {count1} cards from {zone1} for {count2} cards from {zone2}',
      args: { player, zone1, zone2, count1: cards1.length, count2: cards2.length }
    })

    this.actions.acted(player)
  }

  _aKarmaHelper(player: UltimatePlayer, infos: KarmaInfo[], opts: Record<string, unknown> = {}): string | undefined {
    let info = infos[0]

    if (infos.length === 0) {
      return
    }

    /*
       from the rules:
       In the rare case that multiple "Would" karmas are triggered
       by the same game event, the current player decides which
       karma occurs and ignores the others.
     */
    else if (infos.length > 1) {
      if (info.impl.kind && info.impl.kind.startsWith('would')) {
        this.log.add({
          template: 'Multiple `would` karma effects would trigger, so {player} will choose one',
          args: { player: this.players.current() }
        })

        const infoChoices = infos.map((info: KarmaInfo) => info.card)
        const chosenCard = this.actions.chooseCard(
          this.players.current(),
          infoChoices,
          { title: 'Choose a would karma to trigger' }
        )
        info = infos.find((info: KarmaInfo) => info.card === chosenCard)!
      }
      else {
        throw new Error('Multiple non-would Karmas not handled')
      }
    }

    opts = { ...opts, owner: info.owner, self: info.card }

    if (info.impl.kind && info.impl.kind.startsWith('would')) {
      if (opts.trigger === 'splay') {
        this.log.add({
          template: '{player} would splay {color}, triggering...',
          args: {
            player,
            color: opts.direction
          }
        })
      }
      else if (opts.trigger === 'no-share') {
        this.log.add({
          template: '{player} did not draw a sharing bonus, triggering...',
          args: {
            player,
          }
        })
      }
      else if (opts.trigger === 'dogma') {
        this.log.add({
          template: '{player} would take a Dogma action, triggering...',
          args: {
            player,
          }
        })
      }
      else if (opts.trigger === 'draw') {
        this.log.add({
          template: '{player} would draw a card, triggering...',
          args: {
            player,
          }
        })
      }
      else if (opts.trigger === 'draw-action') {
        this.log.add({
          template: '{player} would take a draw action, triggering...',
          args: {
            player,
          }
        })
      }
      else if (opts.trigger === 'decree') {
        this.log.add({
          template: '{player} would issue a decree, triggering...',
          args: {
            player,
          },
        })
      }
      else if (opts.trigger === 'exchange') {
        this.log.add({
          template: '{player} would exchange cards, triggering...',
          args: {
            player,
          }
        })
      }
      else {
        this.log.add({
          template: '{player} would {trigger} {card}, triggering...',
          args: {
            player,
            trigger: opts.trigger,
            card: opts.card,
          }
        })
      }
    }
    this.log.add({
      template: '{card} karma: {text}',
      args: {
        card: info.card,
        text: info.text
      }
    })
    this.log.indent()
    this._karmaIn()
    const result = this.aCardEffect(player, info, opts)
    this._karmaOut()
    this.log.outdent()

    if (info.impl.kind === 'variable' || info.impl.kind === 'game-over') {
      return result as string | undefined
    }
    else {
      return info.impl.kind
    }
  }

  aKarma(player: UltimatePlayer, kind: string, opts: Record<string, unknown> = {}): string | undefined {
    const infos = this
      .getInfoByKarmaTrigger(player, kind)
      .filter((info: KarmaInfo) => info.impl.matches)
      .filter((info: KarmaInfo) => {
        return info.impl.matches!(this, player, { ...opts, owner: info.owner, self: info.card })
      })

    return this._aKarmaHelper(player, infos, { ...opts, trigger: kind })
  }

  aYouLose(player: UltimatePlayer, card: Card): void {
    this.log.add({
      template: '{player} loses the game due to {card}',
      args: { player, card },
    })
    ;(player as UltimatePlayer & { dead: boolean }).dead = true

    const livingPlayers = this.players.all().filter((player: UltimatePlayer & { dead?: boolean }) => !player.dead)

    if (livingPlayers.length === 1) {
      this.youWin(livingPlayers[0], card.name)
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Checkers

  checkAchievementAvailable(name: string): boolean {
    return !!this.zones.byId('achievements').cardlist().find((ach: Card) => ach.name === name)
  }

  checkAchievementEligibility(player: UltimatePlayer, card: Card, opts: { ignoreAge?: boolean; ignoreScore?: boolean } = {}): boolean {
    const topCardAge = this.getHighestTopAge(player, { reason: 'achieve' })

    const ageRequirement = opts.ignoreAge || card.getAge() <= topCardAge
    const scoreRequirement = opts.ignoreScore || this.checkScoreRequirement(player, card, opts)
    return ageRequirement && scoreRequirement
  }

  checkAgeZeroInPlay(): boolean {
    return false
  }

  checkColorIsSplayed(player: UltimatePlayer, color: string): boolean {
    return this.zones.byPlayer(player, color).splay !== 'none'
  }

  checkEffectIsVisible(card: Card): boolean {
    return !!(card.visibleEffects('dogma') || card.visibleEffects('echo'))
  }

  checkInKarma(): boolean {
    return this.state.karmaDepth > 0
  }

  checkIsFirstBaseDraw(player: UltimatePlayer): boolean {
    return !this.state.drawInfo[player.name].drewFirstBaseCard
  }

  checkScoreRequirement(player: UltimatePlayer, card: Card, opts: Record<string, unknown> = {}): boolean {
    return this.getScoreCost(player, card) <= this.getScore(player, opts)
  }

  checkZoneHasVisibleDogmaOrEcho(player: UltimatePlayer, zone: Zone): boolean {
    return (
      this.getVisibleEffectsByColor(player, zone.color!, 'dogma').length > 0
      || this.getVisibleEffectsByColor(player, zone.color!, 'echo').length > 0
    )
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Getters

  getAchievementsByPlayer(player: UltimatePlayer): AchievementDetails {
    const ach: AchievementDetails = {
      standard: [],
      special: [],
      other: [],
      total: 0
    }

    for (const card of this.zones.byPlayer(player, 'achievements').cardlist()) {
      if (card.isSpecialAchievement || card.isDecree) {
        ach.special.push(card)
      }
      else {
        ach.standard.push(card)
      }
    }

    const karmaInfos = this.getInfoByKarmaTrigger(player, 'extra-achievements')
    for (const info of karmaInfos) {
      const count = info.impl.func!(this, player) as number
      for (let i = 0; i < count; i++) {
        ach.other.push(info.card)
      }
    }

    // Flags and Fountains
    const cards = this.zones.colorStacks(player).flatMap((zone: Zone) => zone.cardlist())
    const flags = cards.filter((card: Card) => card.checkBiscuitIsVisible(';'))
    const fountains = cards.filter((card: Card) => card.checkBiscuitIsVisible(':'))

    for (const card of flags) {
      // Player must have the most or tied for the most visible cards of that color to get the achievement.
      const myCount = card.zone.numVisibleCards()
      const otherCounts = this
        .players
        .other(player)
        .map((other: UltimatePlayer) => this.zones.byPlayer(other, card.color).numVisibleCards())

      if (otherCounts.every((otherCount: number) => otherCount <= myCount)) {
        const count = card.visibleBiscuits().split(';').length - 1
        for (let i = 0; i < count; i++) {
          ach.other.push(card)
        }
      }
    }

    for (const card of fountains) {
      const count = card.visibleBiscuits().split(':').length - 1
      for (let i = 0; i < count; i++) {
        ach.other.push(card)
      }
    }

    ach.total = ach.standard.length + ach.special.length + ach.other.length

    return ach
  }

  getAges(): number[] {
    if (this.state.useAgeZero) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
    else {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
  }

  getMinAge(): number {
    return this.getAges()[0]
  }

  getMaxAge(): number {
    return this.getAges().slice(-1)[0]
  }

  getBiscuits(): Record<string, BiscuitCounts> {
    const biscuits = this
      .players
      .all()
      .map((player: UltimatePlayer) => [player.name, player.biscuits()])
    return Object.fromEntries(biscuits)
  }

  getBonuses(player: UltimatePlayer): number[] {
    const bonuses = this
      .util.colors()
      .flatMap((color: string) => this.zones.byPlayer(player, color))
      .flatMap((zone: Zone) => zone.cardlist().flatMap((card: Card) => card.getBonuses()))

    const karmaBonuses = this
      .getInfoByKarmaTrigger(player, 'list-bonuses')
      .flatMap((info: KarmaInfo) => info.impl.func!(this, player) as number[])

    return bonuses
      .concat(karmaBonuses)
      .sort((l: number, r: number) => r - l)
  }

  getAgesByZone(player: UltimatePlayer, zoneName: string): number[] {
    const ages = this.cards.byPlayer(player, zoneName).map((c: Card) => c.getAge())
    return util.array.distinct(ages).sort()
  }

  getEffectAge(card: Card, age: number): number {
    const player = this.players.byOwner(card)

    if (player) {
      const karmaInfos = this.getInfoByKarmaTrigger(player, 'effect-age')
      if (karmaInfos.length === 0) {
        // No karma, so use age as is
      }
      else if (karmaInfos.length > 1) {
        throw new Error('Multiple effect-age karmas not supported')
      }
      else {
        age = karmaInfos[0].impl.func!(this, player, { card, age }) as number
      }
    }

    if (this.state.dogmaInfo.globalAgeIncrease) {
      age += this.state.dogmaInfo.globalAgeIncrease
    }

    return age
  }

  getInfoByKarmaTrigger(player: UltimatePlayer, trigger: string): KarmaInfo[] {
    util.assert(typeof player.name === 'string', 'First parameter must be player object')
    util.assert(typeof trigger === 'string', 'Second parameter must be string.')

    // Karmas can't trigger while executing another karma.
    const isTriggeredKarma = !trigger.startsWith('list-') || trigger.endsWith('-effects')

    if (isTriggeredKarma && this.checkInKarma()) {
      return []
    }

    const global = this
      .players
      .other(player)
      .flatMap((opp: UltimatePlayer) => this.cards.tops(opp))
      .flatMap((card: Card) => card.getKarmaInfo(trigger))
      .filter((info: KarmaInfo) => info.impl.triggerAll)

    const thisPlayer = this
      .cards
      .tops(player)
      .flatMap((card: Card) => card.getKarmaInfo(trigger))

    const all = [...thisPlayer, ...global]
      .map((info: KarmaInfo) => ({ ...info, owner: this.players.byOwner(info.card) }))

    return all
  }

  getEffectByText(card: Card, text: string): (game: unknown, player: UltimatePlayer) => void {
    for (const kind of ['dogma', 'echo']) {
      const effects = card.visibleEffects(kind)
      if (!effects) {
        continue
      }
      const { texts, impls } = effects
      const index = texts.indexOf(text)
      if (index !== -1) {
        return impls[index]
      }
    }

    throw new Error(`Effect not found on ${card.name} for text ${text}`)
  }

  getExpansionList(): string[] {
    return this.settings.expansions
  }

  getHighestTopAge(player: UltimatePlayer, opts: { reason?: string } = {}): number {
    const card = this.getHighestTopCard(player)
    const baseAge = card ? card.getAge() : 0

    const karmaAdjustment = this
      .getInfoByKarmaTrigger(player, 'add-highest-top-age')
      .filter((info: KarmaInfo) => info.impl.reason !== undefined)
      .filter((info: KarmaInfo) => info.impl.reason === 'all' || info.impl.reason === opts.reason)
      .reduce((l: number, r: KarmaInfo) => l + (r.impl.func!(this, player) as number), 0)

    return baseAge + karmaAdjustment
  }

  getHighestTopCard(player: UltimatePlayer): Card | undefined {
    return this.util.highestCards(this.cards.tops(player), { visible: true })[0]
  }

  getNonEmptyAges(): number[] {
    return this
      .getAges()
      .filter((age: number) => this.zones.byDeck('base', age).cardlist().length > 0)
  }

  getNumAchievementsToWin(): number {
    const base = 6
    const numPlayerAdjustment = 2 - this.players.all().length
    const numExpansionAdjustment = this.getExpansionList().length - 1

    return base + numPlayerAdjustment + numExpansionAdjustment
  }

  getScore(player: UltimatePlayer, opts: { doubleScore?: boolean; excludeCards?: Card[] } = {}): number {
    return this.getScoreDetails(player, opts).total * (opts.doubleScore ? 2 : 1)
  }

  getScoreDetails(player: UltimatePlayer, opts: { excludeCards?: Card[] } = {}): ScoreDetails {
    const details: ScoreDetails = {
      score: [],
      bonuses: [],
      karma: [],

      scorePoints: 0,
      bonusPoints: 0,
      karmaPoints: 0,
      total: 0
    }

    details.score = this
      .cards
      .byPlayer(player, 'score')
      .filter((card: Card) => !opts.excludeCards || opts.excludeCards.findIndex((x: Card) => x.id !== card.id) === -1)
      .map((card: Card) => card.getAge())
      .sort()
    details.bonuses = this.getBonuses(player)
    details.karma = this
      .getInfoByKarmaTrigger(player, 'calculate-score')
      .map((info: KarmaInfo) => ({ name: info.card.name, points: this.aCardEffect(player, info) as number }))

    details.scorePoints = details.score.reduce((l: number, r: number) => l + r, 0)
    details.bonusPoints = (details.bonuses[0] || 0) + Math.max(details.bonuses.length - 1, 0)
    details.karmaPoints = details.karma.reduce((l: number, r: { points: number }) => l + r.points, 0)
    details.total = details.scorePoints + details.bonusPoints + details.karmaPoints

    return details
  }

  getSplayedZones(player: UltimatePlayer): Zone[] {
    return this
      .util.colors()
      .map((color: string) => this.zones.byPlayer(player, color))
      .filter((zone: Zone) => zone.splay !== 'none')
  }

  getUniquePlayerWithMostBiscuits(biscuit: keyof BiscuitCounts): UltimatePlayer | undefined {
    const biscuits = this.getBiscuits()

    let most = 0
    let mostPlayerNames: string[] = []
    for (const [playerName, bis] of Object.entries(biscuits)) {
      const count = bis[biscuit]
      if (count > most) {
        most = count
        mostPlayerNames = [playerName]
      }
      else if (count === most) {
        mostPlayerNames.push(playerName)
      }
    }

    if (most > 0 && mostPlayerNames.length === 1) {
      return this.players.byName(mostPlayerNames[0])
    }
  }

  getVisibleEffectsByColor(player: UltimatePlayer | null, color: string, kind: string): VisibleEffectsResult[] {
    const karma = this
      .getInfoByKarmaTrigger(player!, `list-${kind}-effects`)

    if (karma.length === 1) {
      this.state.karmaDepth += 1
      const result = karma.flatMap((info: KarmaInfo) => info.impl.func!(this, player!, { color, kind }) as VisibleEffectsResult[])
      this.state.karmaDepth -= 1
      return result
    }

    else if (karma.length === 2) {
      throw new Error(`Too many list-effect karmas`)
    }

    else {
      return this
        .cards
        .byPlayer(player!, color)
        .reverse()
        .map((card: Card) => card.visibleEffects(kind))
        .filter((effect: VisibleEffectsResult | undefined): effect is VisibleEffectsResult => effect !== undefined)
    }
  }

  getColorZonesByPlayer(player: UltimatePlayer): Zone[] {
    return this
      .util.colors()
      .map((color: string) => this.zones.byPlayer(player, color))
  }

  getSafeOpenings(player: UltimatePlayer): number {
    return Math.max(0, this.getSafeLimit(player) - this.cards.byPlayer(player, 'safe').length)
  }

  getSafeLimit(player: UltimatePlayer): number {
    return this.getZoneLimit(player)
  }

  getForecastLimit(player: UltimatePlayer): number {
    return this.getZoneLimit(player)
  }

  getZoneLimit(player: UltimatePlayer): number {
    const splays = this
      .util.colors()
      .map((color: string) => this.zones.byPlayer(player, color).splay)

    if (splays.includes('aslant')) {
      return 1
    }
    else if (splays.includes('up')) {
      return 2
    }
    else if (splays.includes('right')) {
      return 3
    }
    else if (splays.includes('left')) {
      return 4
    }
    else {
      return 5
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Setters

  mAchievementCheck(): void {
    const available = this.zones.byId('achievements').cardlist()
    for (const player of this.players.startingWithCurrent()) {
      const reduceCost = this.getInfoByKarmaTrigger(
        player,
        'reduce-special-achievement-requirements'
      ).length > 0
      for (const card of available) {
        if (
          card.zone.name() === 'achievements'
          && card.checkPlayerIsEligible
          && card.checkPlayerIsEligible(this, player, reduceCost)
        ) {
          this.actions.claimAchievement(player, { card })
        }
      }
    }
  }

  mAdjustCardVisibility(card: Card): void {
    if (!this.state.initializationComplete) {
      return
    }

    const zone = card.zone
    const kind = zone.kind()

    if (kind === 'public') {
      card.visibility = this.players.all().map((p: UltimatePlayer) => p.name)
    }

    else if (kind === 'private') {
      util.array.pushUnique(card.visibility, zone.owner!.name)
    }

    else if (kind === 'hidden') {
      card.visibility = []
    }

    else {
      throw new Error(`Unknown zone kind ${kind} for zone ${zone.id}`)
    }
  }

  mMoveByIndices(source: Zone, sourceIndex: number, target: Zone, targetIndex: number): Card {
    util.assert(sourceIndex >= 0 && sourceIndex <= source.cardlist().length - 1, `Invalid source index ${sourceIndex}`)
    const sourceCards = source._cards
    const targetCards = target._cards
    const card = sourceCards[sourceIndex]
    sourceCards.splice(sourceIndex, 1)
    targetCards.splice(targetIndex, 0, card)
    card.zone = target

    const zoneOwner = this.players.byZone(target)
    card.owner = zoneOwner ? zoneOwner : null

    this.mAdjustCardVisibility(card)
    return card
  }

  mMoveCardTo(card: Card, target: Zone, opts: { index?: number } = {}): Card | undefined {
    const source = card.zone
    const sourceIndex = source.cardlist().findIndex((c: Card) => c === card)
    const targetIndex = opts.index === undefined ? target.cardlist().length : opts.index

    if (source === target && sourceIndex === targetIndex) {
      // Card is already in the target zone.
      return
    }

    this.mMoveByIndices(source, sourceIndex, target, targetIndex)

    return card
  }

  mMoveCardsTo(player: UltimatePlayer, cards: Card[], target: Zone): void {
    for (const card of cards) {
      this.log.add({
        template: '{player} moves {card} to {zone}',
        args: { player, card, zone: target }
      })
      card.moveTo(target)
    }

    if (cards.length > 0) {
      this.actions.acted(player)
    }
  }

  mMoveTopCard(source: Zone, target: Zone): Card {
    return this.mMoveByIndices(source, 0, target, target.cardlist().length)
  }

  _attemptToCombineWithPreviousEntry(msg: { template: string; args?: { player?: { value: string }; card?: { card: Card } } }): boolean {
    if (this.log.getLog().length === 0) {
      return false
    }

    const prev = this.log.getLog().slice(-1)[0] as LogEntry & { args?: { player?: { value: string }; card?: { card: Card } } }

    if (!prev.args) {
      return false
    }

    const combinable = ['foreshadows', 'melds', 'returns', 'tucks', 'reveals', 'scores', 'safeguards']
    const msgAction = msg.template.split(' ')[1]

    const msgIsCombinable = combinable.includes(msgAction)
    const prevWasDraw = (
      prev.template === '{player} draws {card}'
      || prev.template === '{player} draws and reveals {card}'
    )

    if (msgIsCombinable && prevWasDraw) {
      const argsMatch = (
        prev.args.player?.value === msg.args?.player?.value
        && prev.args.card?.card === msg.args?.card?.card
      )

      if (argsMatch) {
        prev.template = prev.template.slice(0, -6) + 'and ' + msgAction + ' {card}'
        prev.args.card = msg.args?.card
        return true
      }
    }

    return false
  }

  mRemove(card: Card): Card {
    return card.moveTo(this.zones.byId('junk'))
  }

  mResetDogmaInfo(): void {
    this.state.dogmaInfo = {} as DogmaInfo
  }

  mResetDrawInfo(): void {
    this.state.drawInfo = {}
    for (const player of this.players.all()) {
      this.state.drawInfo[player.name] = {
        drewFirstBaseCard: false
      }
    }
  }

  mResetPeleCount(): void {
    this.state.tuckedGreenForPele = []
  }

  mSetFirstBaseDraw(player: UltimatePlayer): void {
    this.state.drawInfo[player.name].drewFirstBaseCard = true
  }

  mTake(player: UltimatePlayer, card: Card): Card {
    const hand = this.zones.byPlayer(player, 'hand')
    card.moveTo(hand)
    this.log.add({
      template: '{player} takes {card} into hand',
      args: { player, card }
    })
    this.actions.acted(player)
    return card
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Private functions

  _generateActionChoices(): unknown[] {
    const choices = []
    choices.push(this._generateActionChoicesAchieve())
    choices.push(this._generateActionChoicesDecree())
    choices.push(this._generateActionChoicesDraw())
    choices.push(this._generateActionChoicesDogma())
    choices.push(this._generateActionChoicesEndorse())
    choices.push(this._generateActionChoicesAuspice())
    choices.push(this._generateActionChoicesMeld())
    return choices
  }

  getScoreCost(player: UltimatePlayer, card: Card): number {
    const sameAge = this
      .zones.byPlayer(player, 'achievements')
      .cardlist()
      .filter((c: Card) => c.getAge() === card.getAge())

    const karmaAdjustment = this
      .getInfoByKarmaTrigger(player, 'achievement-cost-discount')
      .map((info: KarmaInfo) => info.impl.func!(this, player, { card }) as number)
      .reduce((l: number, r: number) => l + r, 0)

    return card.getAge() * 5 * (sameAge.length + 1) - karmaAdjustment
  }

  /**
     This one gets special achievements as well.
   */
  getAvailableAchievements(player: UltimatePlayer): Card[] {
    return [
      ...this.getAvailableSpecialAchievements(player),
      ...this.getAvailableStandardAchievements(player),
    ]
  }

  getAvailableAchievementsByAge(player: UltimatePlayer, age: number | string): Card[] {
    age = parseInt(age as string)
    return this.getAvailableStandardAchievements(player).filter((c: Card) => c.getAge() === age)
  }

  getAvailableMuseums(): Card[] {
    return this
      .cards
      .byZone('achievements')
      .filter((c: Card) => c.isMuseum)
      .sort((l: Card, r: Card) => l.name.localeCompare(r.name))
  }

  getAvailableStandardAchievements(player: UltimatePlayer): Card[] {
    const achievementsZone = this
      .zones
      .byId('achievements')
      .cardlist()
      .filter((c: Card) => !c.isSpecialAchievement && !c.isDecree && !c.isMuseum)

    const fromKarma = this
      .getInfoByKarmaTrigger(player, 'list-achievements')
      .flatMap((info: KarmaInfo) => info.impl.func!(this, player) as Card[])

    return [achievementsZone, fromKarma].flat()
  }

  getAvailableSpecialAchievements(_player: UltimatePlayer): Card[] {
    return this
      .cards
      .byZone('achievements')
      .filter((c: Card) => c.isSpecialAchievement)
  }

  getEligibleAchievementsRaw(player: UltimatePlayer, opts: Record<string, unknown> = {}): Card[] {
    return this
      .getAvailableStandardAchievements(player)
      .filter((card: Card) => this.checkAchievementEligibility(player, card, opts as { ignoreAge?: boolean; ignoreScore?: boolean }))
  }

  formatAchievements(array: Card[]): string[] {
    return array
      .map((ach: Card) => {
        if (ach.zone.id === 'achievements') {
          return ach.getHiddenName()
        }
        else {
          return ach.id
        }
      })
      .sort()
  }

  getEligibleAchievements(player: UltimatePlayer, opts: Record<string, unknown> = {}): string[] {
    const formatted = this.formatAchievements(this.getEligibleAchievementsRaw(player, opts))
    const standard = util.array.distinct(formatted).sort((l: string, r: string) => {
      if ((l as unknown as { exp: string }).exp === (r as unknown as { exp: string }).exp) {
        return (l as unknown as { age: number }).age < (r as unknown as { age: number }).age ? -1 : 1
      }
      else {
        return (l as unknown as { exp: string }).exp.localeCompare((r as unknown as { exp: string }).exp)
      }
    })

    const secrets = this
      .cards.byPlayer(player, 'safe')
      .filter((card: Card) => this.checkAchievementEligibility(player, card))
      .map((card: Card) => `safe: ${card.getHiddenName()}`)
      .sort()

    return [
      ...standard,
      ...secrets,
    ]
  }

  _generateActionChoicesAchieve(): { title: string; choices: string[]; min: number } {
    const player = this.players.current()

    return {
      title: 'Achieve',
      choices: this.getEligibleAchievements(player),
      min: 0,
    }
  }

  _generateActionChoicesDecree(): { title: string; choices: string[]; min: number } {
    const player = this.players.current()

    const figuresInHand = this
      .zones
      .byPlayer(player, 'hand')
      .cardlist()
      .filter((c: Card) => c.checkIsFigure())

    const figuresByAge = this.util.separateByAge(figuresInHand)

    const availableDecrees: string[] = []

    if (this.getInfoByKarmaTrigger(player, 'decree-for-any-three').length > 0 && figuresInHand.length >= 3) {
      for (const color of this.util.colors()) {
        availableDecrees.push(this.util.colorToDecree(color))
      }
    }

    if (Object.keys(figuresByAge).length >= 3) {
      figuresInHand
        .map((card: Card) => card.color)
        .map((color: string) => this.util.colorToDecree(color))
        .forEach((decree: string) => util.array.pushUnique(availableDecrees, decree))
    }

    if (figuresInHand.length >= 2) {
      this
        .getInfoByKarmaTrigger(player, 'decree-for-two')
        .map((info: KarmaInfo) => info.impl.decree!)
        .forEach((decree: string) => util.array.pushUnique(availableDecrees, decree))
    }

    return {
      title: 'Decree',
      choices: availableDecrees.sort(),
      min: 0,
    }
  }

  getDogmaTargets(player: UltimatePlayer): Card[] {
    return this
      .util.colors()
      .map((color: string) => this.zones.byPlayer(player, color))
      .filter((zone: Zone) => this.checkZoneHasVisibleDogmaOrEcho(player, zone))
      .map((zone: Zone) => zone.cardlist()[0])
  }

  _generateActionChoicesDogma(): { title: string; choices: string[]; min: number } {
    const player = this.players.current()

    const dogmaTargets = this.cards.tops(player).filter((card: Card) => card.dogma.length > 0)

    const extraEffects = this
      .getInfoByKarmaTrigger(player, 'list-effects')
      .flatMap((info: KarmaInfo) => info.impl.func!(this, player) as Card[])

    const allTargets = util
      .array
      .distinct([...dogmaTargets, ...extraEffects])
      .map((card: Card) => card.name)

    return {
      title: 'Dogma',
      choices: allTargets,
      min: 0,
    }
  }

  _generateActionChoicesDraw(): { title: string; choices: string[]; min: number } {
    return {
      title: 'Draw',
      choices: ['draw a card'],
      min: 0,
    }
  }

  _generateActionChoicesAuspice(): { title: string; choices: string[]; min: number } {
    const standardBiscuits = Object.keys(this.util.emptyBiscuits())
    const _isStandardBiscuit = function(biscuit: string): boolean {
      return standardBiscuits.includes(biscuit)
    }
    const player = this.players.current()
    const topFigureBiscuits = this
      .cards
      .tops(player)
      .filter((card: Card) => card.checkIsFigure())
      .flatMap((card: Card) => card.biscuits.split('').filter((biscuit: string) => _isStandardBiscuit(biscuit)))
      .filter((biscuit: string) => biscuit !== 'p') // Can't auspice person biscuits because that doesn't change anything.

    const validAuspiceTargets = this
      .cards
      .tops(player)
      .filter((card: Card) => topFigureBiscuits.includes(card.dogmaBiscuit))
      .filter((card: Card) => card.dogma.length > 0)

    return {
      title: 'Auspice',
      choices: validAuspiceTargets.map((card: Card) => card.name),
      min: 0,
    }
  }

  _generateActionChoicesEndorse(): { title: string; choices: string[]; min: number } {
    const player = this.players.current()

    const lowestHandAge = this
      .zones.byPlayer(player, 'hand')
      .cardlist()
      .map((card: Card) => card.getAge())
      .sort((l: number, r: number) => l - r)[0] || 99

    const cities = this
      .cards.tops(player)
      .filter((card: Card) => card.checkIsCity())
      .filter((city: Card) => city.getAge() >= lowestHandAge)

    const stacksWithEndorsableEffects = this
      .cards.tops(player)
      .map((card: Card) => this.zones.byPlayer(player, card.color))

    const colors: string[] = []

    if (!this.state.didEndorse) {
      for (const zone of stacksWithEndorsableEffects) {
        if (zone.cardlist().length === 0) {
          throw new Error('"Endorsable" stack has no cards: ' + zone.id)
        }

        const dogmaBiscuit = zone.cardlist()[0].dogmaBiscuit
        const canEndorse = cities.some((city: Card) => city.biscuits.includes(dogmaBiscuit))
        if (canEndorse) {
          colors.push(zone.color!)
        }
      }
    }

    return {
      title: 'Endorse',
      choices: colors,
      min: 0,
    }
  }

  _generateActionChoicesMeld(): { title: string; choices: string[]; min: number; max: number } {
    const player = this.players.current()
    const cards = this
      .zones
      .byPlayer(player, 'hand')
      .cardlist()

    this
      .cards
      .byPlayer(player, 'museum')
      .filter((card: Card) => !card.isMuseum)
      .forEach((card: Card) => cards.push(card))

    return {
      title: 'Meld',
      choices: cards.map((c: Card) => c.id),
      min: 0,
      max: 1,
    }
  }

  _karmaIn(): void {
    this.state.karmaDepth += 1
  }

  _karmaOut(): void {
    util.assert(this.state.karmaDepth > 0, "Stepping out of zero karma")
    this.state.karmaDepth -= 1
  }

  _walkZones(root: Record<string, Zone | Record<string, Zone>>, fn: (zone: Zone, path: string[]) => void, path: string[] = []): void {
    for (const [key, obj] of Object.entries(root)) {
      const thisPath = [...path, key]
      if ((obj as Zone)._cards) {
        fn(obj as Zone, thisPath)
      }
      else {
        this._walkZones(obj as Record<string, Zone>, fn, thisPath)
      }
    }
  }

  // Required by base class
  acted(player: UltimatePlayer): void {
    this.actions.acted(player)
  }
}

function InnovationFactory(settings: GameSettings, viewerName: string): Innovation {
  const data = GameFactory(settings)
  return new Innovation(data, viewerName)
}

function factoryFromLobby(lobby: Lobby): unknown {
  return GameFactory({
    game: 'Innovation: Ultimate',
    version: 5,
    name: lobby.name,
    expansions: lobby.options.expansions,
    randomizeExpansions: lobby.options.randomizeExpansions,
    players: lobby.users,
    seed: lobby.seed,
  })
}

export {
  GameOverEvent,
  Innovation,
  InnovationFactory,
  factoryFromLobby,
  res,
  SUPPORTED_EXPANSIONS,
}
