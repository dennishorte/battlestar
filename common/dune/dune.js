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

  data.settings.numPlayers = settings.numPlayers || 2
  data.settings.useCHOAM = settings.useCHOAM || false
  data.settings.useRiseOfIx = settings.useRiseOfIx || false
  data.settings.useImmortality = settings.useImmortality || false
  data.settings.useBloodlines = settings.useBloodlines || false

  return new Dune(data, viewerName)
}

function factoryFromLobby(lobby) {
  return DuneFactory({
    game: 'Dune Imperium: Uprising',
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,
    numPlayers: lobby.users.length,
    useCHOAM: lobby.options?.useCHOAM || false,
    useRiseOfIx: lobby.options?.useRiseOfIx || false,
    useImmortality: lobby.options?.useImmortality || false,
    useBloodlines: lobby.options?.useBloodlines || false,
  })
}


////////////////////////////////////////////////////////////////////////////////
// State

Dune.prototype._reset = function() {
  Game.prototype._reset.call(this)

  this.state.round = 0
  this.state.phase = null
  this.state.firstPlayerIndex = 0

  // Board space occupation: { spaceId: playerName | null }
  this.state.boardSpaces = {}

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

  if (this.settings.useLeaders) {
    const leaders = require('./systems/leaders.js')
    leaders.selectLeaders(this)
  }

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
  z('common.reserve.prepareTheWay', 'Prepare the Way', 'public')
  z('common.reserve.spiceMustFlow', 'The Spice Must Flow', 'public')
  z('common.trash', 'Trash', 'hidden')
  z('common.contractDeck', 'Contract Deck', 'hidden')
  z('common.contractMarket', 'Contract Market', 'public')

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

  if (this.settings.useCHOAM) {
    const choam = require('./systems/choam.js')
    choam.initializeContracts(this)
  }
}

Dune.prototype.initializePlayers = function() {
  for (const player of this.players.all()) {
    player.setCounter('water', constants.STARTING_WATER, { silent: true })
    player.setCounter('vp', constants.STARTING_VP[this.settings.numPlayers] || 0, { silent: true })
  }
}

Dune.prototype.initializeObjectives = function() {
  const objectiveCards = require('./res/cards/objectives.js')
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
  for (const player of this.players.all()) {
    const card = available.pop()
    if (!card) {
      break
    }
    this.state.objectives[player.name] = card

    this.log.add({
      template: '{player} draws objective: {card}',
      args: { player, card: card.name },
    })

    if (card.isFirstPlayer) {
      firstPlayerName = player.name
    }
  }

  // Set first player
  if (firstPlayerName) {
    this.state.firstPlayer = firstPlayerName
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
