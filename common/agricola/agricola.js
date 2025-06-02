const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')
const res = require('./resources.js')
const util = require('../lib/util.js')
const Zone = require('../lib/gameZone.js')


module.exports = {
  GameOverEvent,
  Agricola,
  AgricolaFactory,

  constructor: Agricola,
  factory: factoryFromLobby,
  res,
}


function Agricola(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)
}

util.inherit(Game, Agricola)

function AgricolaFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Agricola(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Agricola',
    name: lobby.name,
    expansions: lobby.options.expansions,
    players: lobby.users,
    seed: lobby.seed,
  })
}

Agricola.prototype._mainProgram = function() {
  this.initialize()
  this.draftCards()
  this.mainLoop()
}

Agricola.prototype._gameOver = function(event) {
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

Agricola.prototype.initialize = function() {
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

Agricola.prototype.initializePlayers = function() {
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
  this.state.players.forEach((player, index) => {
    player.index = index
    player.food = index === 0 ? 2 : 3
  })

  // Set the starting player.
  this.mSetStartingPlayer(this.state.players[0])
}

Agricola.prototype.initializeZones = function() {
  this.state.zones = {
    actions: {},
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
  this.state.zones.players = {}
  for (const player of this.players.all()) {
    this.state.zones.players[player.name] = {
      pet: new Zone(this, 'Pet', 'pet'),
      occupations: new Zone(this, 'Occupations', 'private'),
      minorImprovements: new Zone(this, 'Minor Improvements', 'private'),
    }
  }
}

Agricola.prototype.initializeCards = function() {
  // Shuffle the action cards.
  const actionCards = util.array.shuffle([...res.cards.actions], this.random)
  actionCards.sort((l, r) => l.stage - r.stage)
  this.getZoneById('roundDeck').setCards(actionCards)

  // Shuffle and deal the minor improvements and occupations
  const occupations = util.array.shuffle(this.getAllOccupations(), this.random)
  const minorImprovements = util.array.shuffle(this.getAllMinorImprovements(), this.random)
  for (const player of this.players.all()) {
    const occupationZone = this.getZoneByPlayer(player, 'occupations')
    const minorImprovementZone = this.getZoneByPlayer(player, 'minorImprovements')
    for (let i = 0; i < 7; i++) {
      occupationZone.addCard(occupations.pop())
      minorImprovementZone.addCard(minorImprovements.pop())
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Game Functions

Agricola.prototype.draftCards = function() {
  if (this.settings.draft === true) {
    this.state.phase = 'draft'
    throw new Error('Drafting is not yet implemented')
  }
}

Agricola.prototype.mainLoop = function() {
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

Agricola.prototype.preparationPhase = function() {
  this.state.round += 1
}

Agricola.prototype.workPhase = function() {
}

Agricola.prototype.returningHomePhase = function() {
}

Agricola.prototype.fieldPhase = function() {
}

Agricola.prototype.feedingPhase = function() {
}

Agricola.prototype.breedingPhase = function() {
}

////////////////////////////////////////////////////////////////////////////////
// Player Actions


////////////////////////////////////////////////////////////////////////////////
// State inspectors

Agricola.prototype.checkIsHarvestRound = function() {
  return [4, 7, 9, 11, 13, 14].includes(this.state.round)
}

Agricola.prototype.checkGameOver = function() {
  return this.state.round > 14
}

Agricola.prototype.getAllMinorImprovements = function() {
  let minorImprovements = []
  for (const exp of this.settings.expansions) {
    minorImprovements = minorImprovements.concat(res.cards[exp].minorImprovements)
  }
  return minorImprovements
}

Agricola.prototype.getAllOccupations = function() {
  let occupations = []
  for (const exp of this.settings.expansions) {
    occupations = occupations.concat(res.cards[exp].occupations)
  }
  return occupations
}

////////////////////////////////////////////////////////////////////////////////
// Game state update functions

Agricola.prototype.mSetStartingPlayer = function(player) {
  this.state.startingPlayer = player
}
