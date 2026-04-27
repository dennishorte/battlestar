const { Game, GameFactory: BaseFactory, GameOverEvent } = require('../lib/game.js')
const util = require('../lib/util.js')
const res = require('./res/index.js')
const constants = require('./res/constants.js')
const { DuneActionManager } = require('./DuneActionManager.js')
const { DuneLogManager } = require('./DuneLogManager.js')
const { DunePlayerManager } = require('./DunePlayerManager.js')
const deckEngine = require('./systems/deckEngine.js')
const { BaseZone } = require('../lib/game/index.js')
const { roundStartPhase } = require('./phases/roundStart.js')
const { playerTurnsPhase } = require('./phases/playerTurns.js')
const { combatPhase } = require('./phases/combat.js')
const { makersPhase } = require('./phases/makers.js')
const { recallPhase } = require('./phases/recall.js')


////////////////////////////////////////////////////////////////////////////////
// Constructor

function Dune(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName, {
    ActionManager: DuneActionManager,
    LogManager: DuneLogManager,
    PlayerManager: DunePlayerManager,
  })
}

util.inherit(Game, Dune)


////////////////////////////////////////////////////////////////////////////////
// Factory

function DuneFactory(settings, viewerName) {
  const data = BaseFactory(settings)

  data.settings.version = settings.version || 1
  data.settings.numPlayers = settings.numPlayers || 2
  data.settings.useCHOAM = true
  data.settings.useBaseGameCards = settings.useBaseGameCards !== false
  data.settings.useRiseOfIx = settings.useRiseOfIx || false
  data.settings.useImmortality = settings.useImmortality || false
  data.settings.useBloodlines = settings.useBloodlines || false
  data.settings.usePromo = settings.usePromo || false

  return new Dune(data, viewerName)
}

function factoryFromLobby(lobby) {
  return DuneFactory({
    game: 'Dune Imperium: Uprising',
    version: 2,
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,
    numPlayers: lobby.users.length,
    useCHOAM: true,
    useBaseGameCards: lobby.options?.useBaseGameCards !== false,
    useRiseOfIx: lobby.options?.useRiseOfIx || false,
    useImmortality: lobby.options?.useImmortality || false,
    useBloodlines: lobby.options?.useBloodlines || false,
    usePromo: lobby.options?.usePromo || false,
  })
}


////////////////////////////////////////////////////////////////////////////////
// State

Dune.prototype._reset = function() {
  Game.prototype._reset.call(this)

  this.state.round = 0
  this.state.phase = null
  this.state.firstPlayerIndex = 0

  // Board space occupation: { spaceId: playerName[] }
  // Multiple occupants possible via spy infiltration or leader abilities
  // (e.g. Helena Richese ignoring occupancy on green/purple).
  this.state.boardSpaces = {}
  for (const space of res.boardSpaces) {
    this.state.boardSpaces[space.id] = []
  }

  // Control markers: { locationId: playerName | null }
  this.state.controlMarkers = {
    arrakeen: null,
    'spice-refinery': null,
    'imperial-basin': null,
  }

  // Shield Wall
  this.state.shieldWall = true

  // Maker Hooks per player: { playerName: count }
  this.state.makerHooks = {}

  // Leader assignments: { playerName: leaderDef }
  this.state.leaders = {}

  // Objective cards: { playerName: objectiveDef }
  this.state.objectives = {}
  this.state.firstPlayer = null

  // Reserved cards (Helena Richese signet, Manipulate plot): cards removed
  // from Imperium Row, available to the reserving player for -1 persuasion
  // this round. Each entry: { player, round, cardId }.
  this.state.reservedCards = []

  // Faction alliances: { factionId: playerName | null }
  this.state.alliances = {
    emperor: null,
    guild: null,
    'bene-gesserit': null,
    fremen: null,
  }

  // Spies on observation posts: { postId: playerName | null }
  this.state.spyPosts = {}

  // Combat state
  this.state.conflict = {
    cardId: null,
    currentCard: null,     // Card definition for reward parsing
    wonCards: {},           // { playerName: [cardDef, ...] } for battle icon tracking
    deployedTroops: {},    // { playerName: count }
    deployedSandworms: {}, // { playerName: count }
    strengthBreakdown: {}, // { playerName: [{ source, label, amount }] }
  }

  // Bonus spice on Maker spaces
  this.state.bonusSpice = {
    'deep-desert': 0,
    'hagga-basin': 0,
    'imperial-basin': 0,
  }
}


////////////////////////////////////////////////////////////////////////////////
// Main Program

Dune.prototype._mainProgram = function() {
  this.initialize()
  this.mainLoop()
}

Dune.prototype.initialize = function() {
  this.initializeZones()
  this.initializeCards()
  this.initializePlayers()

  // Deal objective cards and determine first player
  this.initializeObjectives()

  this.state.initializationComplete = true
  this._breakpoint('before-leaders')

  const leaders = require('./systems/leaders.js')
  leaders.selectLeaders(this)

  this._breakpoint('initialization-complete')
}

Dune.prototype.initializeZones = function() {
  const z = (id, name, kind, owner) => {
    this.zones.register(new BaseZone(this, id, name, kind, owner))
  }

  // Common zones
  z('common.imperiumDeck', 'Imperium Deck', 'hidden')
  z('common.imperiumRow', 'Imperium Row', 'public')
  z('common.intrigueDeck', 'Intrigue Deck', 'hidden')
  z('common.intrigueDiscard', 'Intrigue Discard', 'public')
  z('common.conflictDeck', 'Conflict Deck', 'hidden')
  z('common.conflictActive', 'Active Conflict', 'public')
  z('common.conflictDiscard', 'Conflict Discard', 'public')
  z('common.reserve.prepareTheWay', 'Prepare the Way', 'public')
  z('common.reserve.spiceMustFlow', 'The Spice Must Flow', 'public')
  z('common.trash', 'Trash', 'hidden')
  z('common.contractDeck', 'Contract Deck', 'hidden')
  z('common.contractMarket', 'Contract Market', 'public')
  z('common.reservedCards', 'Reserved (Manipulate)', 'public')

  // Per-player zones
  for (const player of this.players.all()) {
    z(`${player.name}.deck`, `${player.name}'s Deck`, 'hidden')
    z(`${player.name}.hand`, `${player.name}'s Hand`, 'private', player)
    z(`${player.name}.played`, `${player.name}'s Played`, 'public')
    z(`${player.name}.revealed`, `${player.name}'s Revealed`, 'public')
    z(`${player.name}.discard`, `${player.name}'s Discard`, 'public')
    z(`${player.name}.intrigue`, `${player.name}'s Intrigue`, 'private', player)
    z(`${player.name}.contracts`, `${player.name}'s Contracts`, 'public')
    z(`${player.name}.contractsCompleted`, `${player.name}'s Completed Contracts`, 'public')
  }
}

Dune.prototype.initializeCards = function() {
  deckEngine.initializeCards(this)

  const choam = require('./systems/choam.js')
  choam.initializeContracts(this)
}

Dune.prototype.initializePlayers = function() {
  for (const player of this.players.all()) {
    player.setCounter('water', constants.STARTING_WATER, { silent: true })
    player.setCounter('vp', constants.STARTING_VP[this.settings.numPlayers] || 0, { silent: true })
  }
}

Dune.prototype.initializeObjectives = function() {
  const objectiveCards = require('./res/cards/objectives')
  const numPlayers = this.settings.numPlayers

  // Filter by player count
  let available = objectiveCards.filter(c => {
    if (c.playerCount === 'all') {
      return true
    }
    if (c.playerCount === '1-3' && numPlayers <= 3) {
      return true
    }
    if (c.playerCount === '4+' && numPlayers >= 4) {
      return true
    }
    return false
  })

  // Shuffle
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(this.random() * (i + 1))
    ;[available[i], available[j]] = [available[j], available[i]]
  }

  // Deal one to each player
  let firstPlayerName = null
  let firstPlayerIndex = null
  const allPlayers = this.players.all()
  for (let i = 0; i < allPlayers.length; i++) {
    const player = allPlayers[i]
    const card = available.pop()
    if (!card) {
      break
    }
    this.state.objectives[player.name] = card

    this.log.add({
      template: '{player} draws objective: {card}',
      args: { player, card },
    })

    if (card.isFirstPlayer) {
      firstPlayerName = player.name
      firstPlayerIndex = i
    }
  }

  // Set first player
  if (firstPlayerName) {
    this.state.firstPlayer = firstPlayerName
    this.state.firstPlayerIndex = firstPlayerIndex
    this.log.add({
      template: '{player} is the First Player',
      args: { player: this.players.byName(firstPlayerName) },
    })
  }
}

Dune.prototype.mainLoop = function() {
  while (true) {
    this.state.round++
    this.log.add({
      template: '=== Round {round} ===',
      args: { round: this.state.round },
      event: 'round-start',
    })

    roundStartPhase(this)
    this._breakpoint('after-round-start')
    playerTurnsPhase(this)
    combatPhase(this)
    makersPhase(this)
    recallPhase(this)
  }
}


////////////////////////////////////////////////////////////////////////////////
// Exports

module.exports = {
  GameOverEvent,
  Dune,
  DuneFactory,
  constructor: Dune,
  factory: factoryFromLobby,
  res,
}
