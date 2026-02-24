const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('../lib/game.js')
const res = require('./res/index.js')
const util = require('../lib/util.js')

const { AgricolaActionManager } = require('./AgricolaActionManager.js')
const { AgricolaLogManager } = require('./AgricolaLogManager.js')
const { AgricolaPlayerManager } = require('./AgricolaPlayerManager.js')
const { AgricolaZone } = require('./AgricolaZone.js')
const fenceUtil = require('./util/fencing.js')


module.exports = {
  GameOverEvent,
  Agricola,
  AgricolaFactory,

  constructor: Agricola,
  factory: factoryFromLobby,
  res,

  // Fence utilities
  fenceUtil,
}


function Agricola(serialized_data, viewerName) {
  // Backward compatibility: strip accumulated amounts from saved action space selections.
  // e.g. "Forest (3)" -> "Forest"
  if (serialized_data.responses) {
    for (const response of serialized_data.responses) {
      if (response.selection && Array.isArray(response.selection)) {
        response.selection = response.selection.map(s =>
          typeof s === 'string' ? s.replace(/\s*\(\d+\)$/, '') : s
        )
      }
    }
  }

  Game.call(this, serialized_data, viewerName, {
    ActionManager: AgricolaActionManager,
    LogManager: AgricolaLogManager,
    PlayerManager: AgricolaPlayerManager,
  })
}

util.inherit(Game, Agricola)

function AgricolaFactory(settings, viewerName) {
  const data = GameFactory(settings)
  data.settings = data.settings || {}
  data.settings.useDrafting = settings.useDrafting || false
  data.settings.cardSets = settings.cardSets || res.getCardSetIds()
  data.settings.version = settings.version || 1
  return new Agricola(data, viewerName)
}

function factoryFromLobby(lobby) {
  return AgricolaFactory({
    game: 'Agricola',
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,
    numPlayers: lobby.users.length,
    useDrafting: lobby.options?.useDrafting || false,
    cardSets: lobby.options?.cardSets || res.getCardSetIds(),
    version: 6,
  })
}


////////////////////////////////////////////////////////////////////////////////
// Input Processing

// Backward compatibility: strip accumulated amounts from action space selections.
// e.g. "Forest (3)" -> "Forest". Remove this once all clients send clean action names.
Agricola.prototype.respondToInputRequest = function(response) {
  if (response.selection && Array.isArray(response.selection)) {
    response.selection = response.selection.map(s =>
      typeof s === 'string' ? s.replace(/\s*\(\d+\)$/, '') : s
    )
  }
  return Object.getPrototypeOf(Agricola.prototype).respondToInputRequest.call(this, response)
}


////////////////////////////////////////////////////////////////////////////////
// Main Program

Agricola.prototype._mainProgram = function() {
  this.initialize()

  if (this.settings.useDrafting) {
    this.draftPhase()
  }

  this.mainLoop()
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

Agricola.prototype.initialize = function() {
  this.log.add({ template: 'Initializing game', event: 'round-start' })
  this.log.indent()

  this.initializePlayers()
  this.initializeZones()
  this.initializeActionSpaces()
  this.initializeRoundCards()
  this.initializeMajorImprovements()
  this.initializePlayerCards()

  this.log.outdent()

  this.state.round = 0
  this.state.stage = 0
  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')

  this.initializeStats()
}

Agricola.prototype.initializeStats = function() {
  this.stats = {
    schemaVersion: 1,

    metadata: {
      playerCount: this.players.all().length,
      cardSets: this.settings.cardSets || [],
      useDrafting: this.settings.useDrafting || false,
    },

    // Draft tracking: { cardId: { name, type, setId, pickOrder, pickedBy } }
    draft: {
      picks: {},
    },

    // Card play tracking: { cardId: { name, type, setId, playedBy, roundPlayed } }
    cards: {
      played: {},
    },

    // Per-player data: { playerName: { drafted: [], played: [] } }
    players: {},
  }

  for (const player of this.players.all()) {
    this.stats.players[player.name] = {
      drafted: [],
      played: [],
    }
  }
}

Agricola.prototype.initializePlayers = function() {
  const playerList = this.players.all()

  for (let i = 0; i < playerList.length; i++) {
    const player = playerList[i]
    player.initializeResources()

    // Give starting food
    if (i === 0) {
      player.setResource('food', res.constants.startingFoodFirstPlayer)
      this.state.startingPlayer = player.name
    }
    else {
      player.setResource('food', res.constants.startingFoodOtherPlayers)
    }

    this.log.add({
      template: '{player} starts with {food} food',
      args: { player, food: player.food },
    })
  }

  // Assign deterministic colors based on seating order (version 1 / legacy games)
  if (!this.settings.version || this.settings.version < 2) {
    const defaultColors = ['#f77278', '#73bbfa', '#70fa73', '#fcfc6f', '#f772f7']
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].color = defaultColors[i]
    }
  }
}

Agricola.prototype.initializeZones = function() {
  // Create common zones
  this.zones.register(new AgricolaZone(this, 'common.actionSpaces', 'Action Spaces', 'public'))
  this.zones.register(new AgricolaZone(this, 'common.futureActions', 'Future Actions', 'public'))
  this.zones.register(new AgricolaZone(this, 'common.majorImprovements', 'Major Improvements', 'public'))
  this.zones.register(new AgricolaZone(this, 'common.supply', 'Supply', 'hidden'))

  // Create player zones
  for (const player of this.players.all()) {
    this.zones.register(new AgricolaZone(this, `players.${player.name}.hand`, 'Hand', 'private', player))
    this.zones.register(new AgricolaZone(this, `players.${player.name}.occupations`, 'Occupations', 'public', player))
    this.zones.register(new AgricolaZone(this, `players.${player.name}.minorImprovements`, 'Minor Improvements', 'public', player))
    this.zones.register(new AgricolaZone(this, `players.${player.name}.majorImprovements`, 'Major Improvements', 'public', player))
    this.zones.register(new AgricolaZone(this, `players.${player.name}.farmyard`, 'Farmyard', 'public', player))
  }
}

Agricola.prototype.initializeActionSpaces = function() {
  // Set up base action spaces that are always available
  this.state.actionSpaces = {}
  this.state.activeActions = []

  const playerCount = this.players.all().length

  // Add base actions
  for (const action of res.getBaseActions()) {
    this.addActionSpace(action)
  }

  // Add player-count specific actions
  const additionalActions = res.getAdditionalActionsForPlayerCount(playerCount)
  for (const action of additionalActions) {
    this.addActionSpace(action)
  }

  if (additionalActions.length > 0) {
    this.log.add({
      template: 'Added {count} additional action spaces for {playerCount} players',
      args: { count: additionalActions.length, playerCount },
    })
  }
}

Agricola.prototype.addActionSpace = function(action) {
  this.state.activeActions.push(action.id)

  if (action.type === 'accumulating' && action.accumulates) {
    // Initialize accumulating actions with 0
    this.state.actionSpaces[action.id] = {
      accumulated: 0,
      occupiedBy: null,
    }
  }
  else {
    this.state.actionSpaces[action.id] = {
      occupiedBy: null,
    }
  }

  // Track linked space relationships
  if (action.linkedWith) {
    if (!this.state.linkedSpaces) {
      this.state.linkedSpaces = {}
    }
    this.state.linkedSpaces[action.id] = action.linkedWith
  }
}

// Block the linked space when a linked action is used
Agricola.prototype.blockLinkedSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (action && action.linkedWith) {
    const linkedId = action.linkedWith
    if (this.state.actionSpaces[linkedId]) {
      this.state.actionSpaces[linkedId].blockedBy = actionId
    }
  }
}

/**
 * Call onRoundEnd for all players
 */
Agricola.prototype.callRoundEndHooks = function() {
  const round = this.state.round
  for (const player of this.players.all()) {
    this.callPlayerCardHook(player, 'onRoundEnd', round)
    this.checkCardTriggers(player)
  }
}

Agricola.prototype.callReturnHomeHooks = function() {
  // Call onReturnHomeStart hooks first (e.g., Bohemian)
  this.callCardHook('onReturnHomeStart')
  // Then call onReturnHome hooks (e.g., Night School Student)
  this.callCardHook('onReturnHome')
}

Agricola.prototype.callHarvestHooks = function() {
  this.callCardHook('onHarvest')
}

Agricola.prototype.isHarvestRound = function(round) {
  return res.constants.harvestRounds.includes(round)
}

Agricola.prototype.getCompletedHarvestCount = function() {
  return res.constants.harvestRounds.filter(r => r < this.state.round).length
}

Agricola.prototype.getCompletedFeedingPhases = function() {
  return res.constants.harvestRounds.filter(r => r < this.state.round).length
}

Agricola.prototype.getHarvestNumber = function() {
  return res.constants.harvestRounds.filter(r => r <= this.state.round).length
}


////////////////////////////////////////////////////////////////////////////////
// Main Loop

Agricola.prototype.mainLoop = function() {
  while (!this.gameOver) {
    this.state.round += 1

    if (this.state.round > res.constants.totalRounds) {
      this.endGame()
      break
    }

    // Update stage
    this.state.stage = res.constants.roundToStage[this.state.round]

    this.log.add({
      template: '=== Round {round} (Stage {stage}) ===',
      args: { round: this.state.round, stage: this.state.stage },
      event: 'round-start',
    })
    this.log.indent()

    this.revealRoundAction()
    this.replenishPhase()
    this._breakpoint('replenish-complete')

    // Call round start hooks (collect scheduled resources, check triggers)
    this.callRoundStartHooks()

    this.workPhase()
    this.returnHomePhase()

    // Check for harvest
    if (res.constants.harvestRounds.includes(this.state.round)) {
      this.harvestPhase()
    }

    // Call round end hooks
    this.callRoundEndHooks()

    // Clear newborn status at end of round (after harvest if there was one)
    for (const player of this.players.all()) {
      player.clearNewborns()
    }

    this.log.outdent()
  }
}

Agricola.prototype.revealRoundAction = function() {
  const cardIndex = this.state.round - 1
  if (cardIndex < this.state.roundCardDeck.length) {
    const card = this.state.roundCardDeck[cardIndex]

    // Add to active actions
    this.state.activeActions.push(card.id)

    // Initialize action space state
    if (card.type === 'accumulating' && card.accumulates) {
      this.state.actionSpaces[card.id] = {
        accumulated: 0,
        occupiedBy: null,
      }
    }
    else {
      this.state.actionSpaces[card.id] = {
        occupiedBy: null,
      }
    }

    this.log.add({
      template: 'Round card revealed: {action}',
      args: { action: card.name },
    })

    this.callCardHook('onStageReveal', card.id)

    // Call onRevealRoundCard for all players (e.g., TreeInspector)
    this.callCardHook('onRevealRoundCard', card)

    // Call onStoneActionRevealed if this is a stone accumulation space
    if (card.type === 'accumulating' && card.accumulates && card.accumulates.stone) {
      this.callCardHook('onStoneActionRevealed')
    }
  }
}

Agricola.prototype.getActionSpaceRound = function(actionId) {
  const index = this.state.roundCardDeck.findIndex(card => card.id === actionId)
  return index === -1 ? undefined : index + 1
}

/**
 * Return action space IDs in rounds minRound..maxRound (inclusive) that are unoccupied.
 * Only includes rounds that have been revealed (round <= state.round).
 */
Agricola.prototype.getUnoccupiedActionSpacesInRounds = function(minRound, maxRound) {
  const result = []
  for (let r = minRound; r <= maxRound; r++) {
    if (r > this.state.round) {
      break
    }
    const card = this.state.roundCardDeck[r - 1]
    if (!card) {
      continue
    }
    const actionId = card.id
    const state = this.state.actionSpaces[actionId]
    if (state && !state.occupiedBy) {
      result.push(actionId)
    }
  }
  return result
}

Agricola.prototype.getMostRecentlyRevealedRound = function() {
  return this.state.round
}

////////////////////////////////////////////////////////////////////////////////
// Prototype extensions (extend Agricola.prototype)

require('./actionSpaceQueries')
require('./cardManagement')
require('./scheduled')
require('./anytime')
require('./specialAbilities')
require('./endGame')

require('./phases/draft')
require('./phases/replenish')
require('./phases/work')
require('./phases/returnHome')
require('./phases/harvest')
require('./phases/feeding')
require('./phases/breeding')
