import {
  Game,
  GameFactory,
  GameOverEvent,
  SerializedGame,
} from '../lib/game.js'
import res from './resources.js'
import util from '../lib/util.js'
import { Card } from './card.js'

// temporary filler because old gameZone was deprecated; migrate to BaseZone
class Zone {
  constructor(_game: Agricola, _name: string, _type: string) {}
  setCards(_cards: Card[]): void {}
  addCard(_card: Card): void {}
}

interface PlayerData {
  _id: string
  name: string
}

interface LobbyData {
  name: string
  options: {
    expansions: string[]
  }
  users: PlayerData[]
  seed: string
}

interface GameSettings {
  game?: string
  name: string
  expansions: string[]
  players: PlayerData[]
  seed: string
  draft?: boolean
  numPlayers?: number
}

interface AgricolaPlayer {
  _id: string
  id: string
  name: string
  index?: number
  food?: number
  resources: {
    fences: number
    stables: number
    availableActionTokens: number
    unusedActionTokens: number
    wood: number
    clay: number
    reed: number
    stone: number
    sheep: number
    pigs: number
    cows: number
    food: number
    wheat: number
    vegetables: number
    begging: number
  }
  board: {
    fences: boolean[]
    spaces: (unknown | null)[]
    pastures: unknown[]
    openStables: number
    fields: number
    rooms: number
    houseType: string
  }
}

interface AgricolaState {
  phase: string
  initializationComplete: boolean
  round: number
  players: AgricolaPlayer[]
  zones: {
    actions: Record<string, Zone>
    rounds?: Record<string, Zone>
    roundDeck?: Zone
    players: Record<string, {
      pet: Zone
      occupations: Zone
      minorImprovements: Zone
    }>
  }
  startingPlayer?: AgricolaPlayer
}

interface GameOverData {
  player: AgricolaPlayer
  reason: string
}

class Agricola extends Game {
  declare state: AgricolaState
  declare settings: GameSettings
  declare random: () => number
  declare players: {
    all(): AgricolaPlayer[]
  }
  declare zones: {
    byId(id: string): Zone
    byPlayer(player: AgricolaPlayer, zone: string): Zone
  }
  declare log: {
    add(entry: { template: string; args?: Record<string, unknown> }): void
    indent(): void
    outdent(): void
  }

  constructor(serialized_data: SerializedGame, viewerName?: string) {
    super(serialized_data, viewerName)
  }

  _mainProgram(): void {
    this.initialize()
    this.draftCards()
    this.mainLoop()
  }

  _gameOver(event: { data: GameOverData }): { data: GameOverData } {
    this.log.add({
      template: '{player} wins due to {reason}',
      args: {
        player: event.data.player,
        reason: event.data.reason,
      }
    })
    return event
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Initialization

  initialize(): void {
    this.state.phase = 'initialization'
    this.state.initializationComplete = false

    this.log.add({ template: 'Initializing' })
    this.log.indent()

    this.initializePlayers()
    this.initializeZones()
    this.initializeCards()

    this.log.outdent()

    this.state.round = 0
    this.state.initializationComplete = true

    this._breakpoint('initialization-complete')
  }

  initializePlayers(): void {
    this.state.players = this.settings.players.map(p => ({
      _id: p._id,
      id: p.name,
      name: p.name,

      resources: {
        fences: 15,
        stables: 4,
        availableActionTokens: 2,
        unusedActionTokens: 3,

        wood: 0,
        clay: 0,
        reed: 0,
        stone: 0,

        sheep: 0,
        pigs: 0,
        cows: 0,

        food: 0,
        wheat: 0,
        vegetables: 0,
        begging: 0,
      },

      board: {
        // 5 horizontal across the top; 6 vertical; 5 horizontal; 6; 5; 6; 5
        fences: util.array.fill(5*4 + 6*3, false),
        spaces: util.array.fill(15, null),
        pastures: [],
        openStables: 0,
        fields: 0,
        rooms: 2,
        houseType: 'wood',
      },
    }))

    // Randomize the turn order and give starting food.
    util.array.shuffle(this.state.players, this.random)
    this.state.players.forEach((player: AgricolaPlayer, index: number) => {
      player.index = index
      player.food = index === 0 ? 2 : 3
    })

    // Set the starting player.
    this.mSetStartingPlayer(this.state.players[0])
  }

  initializeZones(): void {
    this.state.zones = {
      actions: {},
      players: {},
    }

    // Add zones for turn based action cards.
    this.state.zones.rounds = {}
    for (let i = 1; i <= 14; i++) {
      const name = `round-${i}`
      this.state.zones.actions[name] = new Zone(this, name, 'round-action')
    }

    // Deck that contains the round action cards.
    this.state.zones.roundDeck = new Zone(this, 'round-deck', 'hidden')

    // Add basic zones.
    this.state.zones.actions.forest = new Zone(this, 'Forest', 'action')
    this.state.zones.actions.clayPit = new Zone(this, 'Clay Pit', 'action')
    this.state.zones.actions.reedBank = new Zone(this, 'Reed Bank', 'action')
    this.state.zones.actions.fishing = new Zone(this, 'Fishing', 'action')
    this.state.zones.actions.farmland = new Zone(this, 'Farmland', 'action')
    this.state.zones.actions.grainSeeds = new Zone(this, 'Grain Seeds', 'action')
    this.state.zones.actions.farmExpansion = new Zone(this, 'Farm Expansion', 'action')
    this.state.zones.actions.lessons = new Zone(this, 'Lessons', 'action')
    this.state.zones.actions.dayLaborer = new Zone(this, 'Day Laborer', 'action')
    this.state.zones.actions.meetingPlace = new Zone(this, 'Meeting Place', 'action')

    if (this.players.all().length === 3) {
      this.state.zones.actions.grove = new Zone(this, 'Grove', 'action')
      this.state.zones.actions.resourceMarket = new Zone(this, 'Resource Market', 'action')
      this.state.zones.actions.hollow = new Zone(this, 'Hollow', 'action')
      this.state.zones.actions.moreLessons = new Zone(this, 'More Lessons', 'action')
    }

    if (this.players.all().length === 4) {
      this.state.zones.actions.copse = new Zone(this, 'Copse', 'action')
      this.state.zones.actions.grove = new Zone(this, 'Grove', 'action')
      this.state.zones.actions.resourceMarket = new Zone(this, 'Resource Market', 'action')
      this.state.zones.actions.hollow = new Zone(this, 'Hollow', 'action')
      this.state.zones.actions.moreLessons = new Zone(this, 'More Lessons', 'action')
      this.state.zones.actions.travelingPlayer = new Zone(this, 'Traveling Players', 'action')
    }

    // Player zones
    // - Player zones are dynamic in Agricola, since players can create new pastures
    //   and divide existing pastures with fences. Any time a player places new fences,
    //   their pasture zones will change. Players initially start with no pastures.
    for (const player of this.players.all()) {
      this.state.zones.players[player.name] = {
        pet: new Zone(this, 'Pet', 'pet'),
        occupations: new Zone(this, 'Occupations', 'private'),
        minorImprovements: new Zone(this, 'Minor Improvements', 'private'),
      }
    }
  }

  initializeCards(): void {
    // Shuffle the action cards.
    const actionCards = util.array.shuffle([...res.default.cards.actions], this.random)
    actionCards.sort((l: { stage?: number }, r: { stage?: number }) => (l.stage ?? 0) - (r.stage ?? 0))
    this.zones.byId('roundDeck').setCards(actionCards as unknown as Card[])

    // Shuffle and deal the minor improvements and occupations
    const occupations = util.array.shuffle(this.getAllOccupations(), this.random)
    const minorImprovements = util.array.shuffle(this.getAllMinorImprovements(), this.random)
    for (const player of this.players.all()) {
      const occupationZone = this.zones.byPlayer(player, 'occupations')
      const minorImprovementZone = this.zones.byPlayer(player, 'minorImprovements')
      for (let i = 0; i < 7; i++) {
        occupationZone.addCard(occupations.pop()!)
        minorImprovementZone.addCard(minorImprovements.pop()!)
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Game Functions

  draftCards(): void {
    if (this.settings.draft === true) {
      this.state.phase = 'draft'
      throw new Error('Drafting is not yet implemented')
    }
  }

  mainLoop(): void {
    this.state.phase = 'main'

    while (!this.checkGameOver()) {
      this.preparationPhase()
      this.workPhase()
      this.returningHomePhase()

      if (this.checkIsHarvestRound()) {
        this.fieldPhase()
        this.feedingPhase()
        this.breedingPhase()
      }
    }
  }

  preparationPhase(): void {
    this.state.round += 1
  }

  workPhase(): void {
  }

  returningHomePhase(): void {
  }

  fieldPhase(): void {
  }

  feedingPhase(): void {
  }

  breedingPhase(): void {
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Player Actions


  ////////////////////////////////////////////////////////////////////////////////
  // State inspectors

  checkIsHarvestRound(): boolean {
    return [4, 7, 9, 11, 13, 14].includes(this.state.round)
  }

  checkGameOver(): boolean {
    return this.state.round > 14
  }

  getAllMinorImprovements(): Card[] {
    let minorImprovements: Card[] = []
    for (const exp of this.settings.expansions) {
      const expCards = res.default.cards[exp as keyof typeof res.default.cards]
      if (expCards && 'minorImprovements' in expCards) {
        minorImprovements = minorImprovements.concat((expCards as { minorImprovements: Card[] }).minorImprovements)
      }
    }
    return minorImprovements
  }

  getAllOccupations(): Card[] {
    let occupations: Card[] = []
    for (const exp of this.settings.expansions) {
      const expCards = res.default.cards[exp as keyof typeof res.default.cards]
      if (expCards && 'occupations' in expCards) {
        occupations = occupations.concat((expCards as { occupations: Card[] }).occupations)
      }
    }
    return occupations
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Game state update functions

  mSetStartingPlayer(player: AgricolaPlayer): void {
    this.state.startingPlayer = player
  }
}

function AgricolaFactory(settings: GameSettings, viewerName?: string): Agricola {
  const data = GameFactory(settings)
  return new Agricola(data.serialize(), viewerName)
}

function factoryFromLobby(lobby: LobbyData): unknown {
  return GameFactory({
    game: 'Agricola',
    name: lobby.name,
    expansions: lobby.options.expansions,
    players: lobby.users,
    seed: lobby.seed,
  })
}

export {
  GameOverEvent,
  Agricola,
  AgricolaFactory,

  Agricola as constructor,
  factoryFromLobby as factory,
}

export { res }
