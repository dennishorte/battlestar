const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('../lib/game.js')
const res = require('./res/index.js')
const util = require('../lib/util.js')

const { AgricolaActionManager } = require('./AgricolaActionManager.js')
const { AgricolaCard } = require('./AgricolaCard.js')
const { AgricolaLogManager } = require('./AgricolaLogManager.js')
const { AgricolaPlayerManager } = require('./AgricolaPlayerManager.js')
const { AgricolaZone } = require('./AgricolaZone.js')


module.exports = {
  GameOverEvent,
  Agricola,
  AgricolaFactory,

  constructor: Agricola,
  factory: factoryFromLobby,
  res,

  // Fence utilities
  fenceUtil: {
    areSpacesConnected,
    calculateFenceEdges,
    countFencesNeeded,
    validatePastureSelection,
  },
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
    version: 3,
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
  this.log.add({ template: 'Initializing game' })
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
      player.food = res.constants.startingFoodFirstPlayer
      this.state.startingPlayer = player.name
    }
    else {
      player.food = res.constants.startingFoodOtherPlayers
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

// ---------------------------------------------------------------------------
// Action space helpers
// ---------------------------------------------------------------------------

Agricola.prototype.getActionById = function(actionId) {
  return res.getActionById(actionId)
}

/**
 * Check if an action space is currently occupied
 */
Agricola.prototype.isActionOccupied = function(actionId) {
  const state = this.state.actionSpaces[actionId]
  return !!(state && state.occupiedBy)
}

/**
 * Check if any player returned from a Lessons action space this round
 * (called during return home phase, before workers are reset)
 */
Agricola.prototype.anyPlayerReturnedFromLessons = function() {
  const lessonsActions = ['occupation', 'lessons-1', 'lessons-2', 'lessons-3', 'lessons-4', 'lessons-5', 'lessons-6']
  for (const actionId of lessonsActions) {
    const state = this.state.actionSpaces[actionId]
    if (state && state.occupiedBy) {
      return true
    }
  }
  return false
}

// ---------------------------------------------------------------------------
// Per-game card state (avoids mutating singleton card definitions)
// ---------------------------------------------------------------------------

Agricola.prototype.cardState = function(id) {
  if (!this.state._cardState) {
    this.state._cardState = {}
  }
  if (!this.state._cardState[id]) {
    this.state._cardState[id] = {}
  }
  return this.state._cardState[id]
}

// ---------------------------------------------------------------------------
// Accumulation space helpers (used by card hooks like TreeCutter, Loudmouth)
// ---------------------------------------------------------------------------

Agricola.prototype.isAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  return !!(action && action.type === 'accumulating')
}

Agricola.prototype.isBuildingResourceAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || action.type !== 'accumulating' || !action.accumulates) {
    return false
  }
  return Object.keys(action.accumulates).some(r => ['wood', 'clay', 'stone', 'reed'].includes(r))
}

Agricola.prototype.getAccumulationSpaceGoodType = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || !action.accumulates) {
    return null
  }
  return Object.keys(action.accumulates)[0]
}

/**
 * Returns { resourceType: amount } for an accumulation space.
 * During onAction hooks for the current action, returns the pre-take amount
 * (since takeAccumulatedResource already reset it to 0).
 * For other spaces, returns the current accumulated amount.
 */
Agricola.prototype.getAccumulatedResources = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || !action.accumulates) {
    return {}
  }

  const actionState = this.state.actionSpaces[actionId]
  if (!actionState) {
    return {}
  }

  // If this is the action currently being taken, use the saved pre-take amount
  const last = this.state.lastAccumulated
  const amount = (last && last.actionId === actionId) ? last.amount : actionState.accumulated

  const result = {}
  for (const resource of Object.keys(action.accumulates)) {
    result[resource] = amount
  }
  return result
}

/**
 * Remove resources from an accumulation space (e.g. Riverine Shepherd taking from the other space).
 */
Agricola.prototype.removeFromAccumulationSpace = function(actionId, resource, amount) {
  const state = this.state.actionSpaces[actionId]
  if (!state || state.accumulated == null) {
    return
  }
  state.accumulated = Math.max(0, (state.accumulated || 0) - amount)
}

Agricola.prototype.hasAccumulationSpaceWithGoods = function(minGoods) {
  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating') {
      const actionState = this.state.actionSpaces[actionId]
      if (actionState && actionState.accumulated >= minGoods) {
        return true
      }
    }
  }
  return false
}

Agricola.prototype.isAccumulationSpaceWith5PlusGoods = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || action.type !== 'accumulating') {
    return false
  }
  const actionState = this.state.actionSpaces[actionId]

  // During onAction for this space, use the pre-take amount
  const last = this.state.lastAccumulated
  const amount = (last && last.actionId === actionId) ? last.amount : (actionState?.accumulated || 0)
  return amount >= 5
}

Agricola.prototype.isRoundActionSpace = function(actionId) {
  const action = res.getActionById(actionId)
  return !!(action && action.stage)
}

/**
 * Returns an array of action space states that accumulate wood.
 * Used by cards like Wood Harvester to check wood accumulation spaces.
 */
Agricola.prototype.getWoodAccumulationSpaces = function() {
  const woodSpaces = []
  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates && action.accumulates.wood) {
      const actionState = this.state.actionSpaces[actionId]
      if (actionState) {
        woodSpaces.push({
          actionId,
          accumulated: actionState.accumulated || 0,
        })
      }
    }
  }
  return woodSpaces
}

Agricola.prototype.actionGivesReed = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }
  return !!(action.accumulates?.reed || action.gives?.reed)
}

Agricola.prototype.isLastInTurnOrder = function(player) {
  const players = this.players.all()
  const startIdx = players.findIndex(p => p.name === this.state.startingPlayer)
  const lastIdx = (startIdx + players.length - 1) % players.length
  return players[lastIdx].name === player.name
}

Agricola.prototype.initializeRoundCards = function() {
  // Shuffle round cards within each stage
  this.state.roundCardDeck = []

  for (let stage = 1; stage <= 6; stage++) {
    const stageCards = res.getRoundCardsByStage(stage)
    const shuffled = this.shuffleArray([...stageCards])
    this.state.roundCardDeck.push(...shuffled)
  }

  this.log.add({
    template: 'Round cards shuffled',
  })
}

// Fisher-Yates shuffle using seeded random
Agricola.prototype.shuffleArray = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(this.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

Agricola.prototype.initializeMajorImprovements = function() {
  // Create AgricolaCard for each major improvement and place in common zone
  const playerCount = this.players.all().length
  const majorZone = this.zones.byId('common.majorImprovements')
  const majorCards = []
  for (const impDef of res.getAllMajorImprovements(playerCount)) {
    const card = new AgricolaCard(this, impDef)
    this.cards.register(card)
    majorCards.push(card)
  }
  majorZone.initializeCards(majorCards)

  if (playerCount >= 6) {
    this.log.add({
      template: 'Added 6-player expansion major improvements',
    })
  }
}

Agricola.prototype.initializePlayerCards = function() {
  const playerCount = this.players.all().length
  const cardsPerPlayer = 7
  const setIds = this.settings.cardSets || res.getCardSetIds()

  // Log which card sets are in use
  const setNames = setIds.map(id => res.cardSets[id]?.name || id).join(', ')
  this.log.add({
    template: `Card sets: ${setNames}`,
  })

  // Get cards appropriate for this player count from the selected sets
  const allCards = res.getCardsByPlayerCount(playerCount, setIds)
  const occupations = allCards.filter(c => c.type === 'occupation')
  const minorImprovements = allCards.filter(c => c.type === 'minor')

  // Shuffle both decks
  const shuffledOccupations = this.shuffleArray([...occupations])
  const shuffledMinors = this.shuffleArray([...minorImprovements])

  // Create AgricolaCard instances for all cards and place in supply zone
  const supplyZone = this.zones.byId('common.supply')
  const createCards = (cardDefs) => {
    return cardDefs.map(def => {
      const card = new AgricolaCard(this, def)
      this.cards.register(card)
      supplyZone.push(card, supplyZone.nextIndex())
      return card
    })
  }

  const occCards = createCards(shuffledOccupations)
  const minorCards = createCards(shuffledMinors)

  if (this.settings.useDrafting) {
    // Set up draft pools - each player gets a starting hand to draft from
    this.state.draftPools = {
      occupations: [],
      minors: [],
    }

    for (let i = 0; i < playerCount; i++) {
      // Create pools of card IDs that will be passed around
      const occPool = occCards
        .splice(0, cardsPerPlayer)
        .map(c => c.id)
      const minorPool = minorCards
        .splice(0, cardsPerPlayer)
        .map(c => c.id)

      this.state.draftPools.occupations.push(occPool)
      this.state.draftPools.minors.push(minorPool)
    }

    this.log.add({
      template: 'Card drafting will begin',
    })
  }
  else {
    // Deal cards directly to each player (no drafting)
    for (let i = 0; i < playerCount; i++) {
      const player = this.players.all()[i]
      const handZone = this.zones.byPlayer(player, 'hand')

      // Deal 7 occupations
      const playerOccCards = occCards.splice(0, cardsPerPlayer)

      // Deal 7 minor improvements
      const playerMinorCards = minorCards.splice(0, cardsPerPlayer)

      // Move cards to player's hand zone
      for (const card of [...playerOccCards, ...playerMinorCards]) {
        card.moveTo(handZone)
      }

      this.log.add({
        template: '{player} receives {occ} occupations and {minor} minor improvements',
        args: { player, occ: playerOccCards.length, minor: playerMinorCards.length },
      })
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Card Hook System
// These methods call hooks on players' cards at appropriate times

/**
 * Get all active cards for a player (played occupations + minor improvements)
 */
Agricola.prototype.getPlayerActiveCards = function(player) {
  const cards = []
  const occZone = this.zones.byPlayer(player, 'occupations')
  if (occZone) {
    cards.push(...occZone.cardlist())
  }
  const minorZone = this.zones.byPlayer(player, 'minorImprovements')
  if (minorZone) {
    cards.push(...minorZone.cardlist())
  }
  return cards
}

/**
 * Call a hook on all of a player's active cards
 * Returns array of results from cards that returned something
 */
Agricola.prototype.callPlayerCardHook = function(player, hookName, ...args) {
  const results = []
  const cards = this.getPlayerActiveCards(player)
  for (const card of cards) {
    if (card.hasHook(hookName)) {
      const result = card.callHook(hookName, this, player, ...args)
      if (result !== undefined) {
        results.push({ card, result })
      }
    }
  }
  return results
}

Agricola.prototype.callCardHook = function(hookName, ...args) {
  for (const player of this.players.all()) {
    this.callPlayerCardHook(player, hookName, ...args)
  }
}

/**
 * Call checkTrigger on all cards for a player to see if any trigger conditions are met
 */
Agricola.prototype.checkCardTriggers = function(player) {
  const cards = this.getPlayerActiveCards(player)
  for (const card of cards) {
    if (card.hasHook('checkTrigger')) {
      card.callHook('checkTrigger', this, player)
    }
  }
}

/**
 * Call onRoundStart for all players
 */
Agricola.prototype.callRoundStartHooks = function() {
  for (const player of this.players.all()) {
    // Collect scheduled resources from cards
    this.collectScheduledResources(player)

    // Call onRoundStart hooks (hooks handle their own actions directly)
    this.callPlayerCardHook(player, 'onRoundStart', this.state.round)

    // Check triggers
    this.checkCardTriggers(player)
  }
}

/**
 * Schedule a resource delivery for a future round.
 * Returns true if scheduled, false if round is past the game end.
 */
Agricola.prototype.scheduleResource = function(player, type, round, amount) {
  if (round > 14) {
    return false
  }
  const stateKey = `scheduled${type[0].toUpperCase()}${type.slice(1)}`
  if (!this.state[stateKey]) {
    this.state[stateKey] = {}
  }
  if (!this.state[stateKey][player.name]) {
    this.state[stateKey][player.name] = {}
  }
  this.state[stateKey][player.name][round] =
    (this.state[stateKey][player.name][round] || 0) + amount
  return true
}

/**
 * Schedule an event for a future round (plows, freeStables, freeOccupation).
 * Returns true if scheduled, false if round is past the game end.
 */
Agricola.prototype.scheduleEvent = function(player, type, round) {
  if (round > 14) {
    return false
  }
  const stateKey = `scheduled${type[0].toUpperCase()}${type.slice(1)}`
  if (!this.state[stateKey]) {
    this.state[stateKey] = {}
  }
  if (!this.state[stateKey][player.name]) {
    this.state[stateKey][player.name] = []
  }
  this.state[stateKey][player.name].push(round)
  return true
}

/**
 * Collect scheduled resources from cards (food, vegetables, clay, etc.)
 */
Agricola.prototype.collectScheduledResources = function(player) {
  const round = this.state.round

  // Scheduled food (Pond Hut, Wall Builder)
  if (this.state.scheduledFood?.[player.name]?.[round]) {
    const amount = this.state.scheduledFood[player.name][round]
    player.addResource('food', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled food',
      args: { player, amount },
    })
    delete this.state.scheduledFood[player.name][round]
  }

  // Scheduled vegetables (Large Greenhouse)
  if (this.state.scheduledVegetables?.[player.name]?.[round]) {
    const amount = this.state.scheduledVegetables[player.name][round]
    player.addResource('vegetables', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled vegetables',
      args: { player, amount },
    })
    delete this.state.scheduledVegetables[player.name][round]
  }

  // Scheduled clay (Clay Hut Builder)
  if (this.state.scheduledClay?.[player.name]?.[round]) {
    const amount = this.state.scheduledClay[player.name][round]
    player.addResource('clay', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled clay',
      args: { player, amount },
    })
    delete this.state.scheduledClay[player.name][round]
  }

  // Scheduled wood (Ceilings, Thick Forest)
  if (this.state.scheduledWood?.[player.name]?.[round]) {
    const amount = this.state.scheduledWood[player.name][round]
    player.addResource('wood', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled wood',
      args: { player, amount },
    })
    delete this.state.scheduledWood[player.name][round]
  }

  // Scheduled grain (Sack Cart, Grain Depot)
  if (this.state.scheduledGrain?.[player.name]?.[round]) {
    const amount = this.state.scheduledGrain[player.name][round]
    player.addResource('grain', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled grain',
      args: { player, amount },
    })
    delete this.state.scheduledGrain[player.name][round]
  }

  // Scheduled reed (Reed Belt)
  if (this.state.scheduledReed?.[player.name]?.[round]) {
    const amount = this.state.scheduledReed[player.name][round]
    player.addResource('reed', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled reed',
      args: { player, amount },
    })
    delete this.state.scheduledReed[player.name][round]
  }

  // Scheduled stone (Club House)
  if (this.state.scheduledStone?.[player.name]?.[round]) {
    const amount = this.state.scheduledStone[player.name][round]
    player.addResource('stone', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled stone',
      args: { player, amount },
    })
    delete this.state.scheduledStone[player.name][round]
  }

  // Scheduled sheep (Sheep Whisperer)
  if (this.state.scheduledSheep?.[player.name]?.[round]) {
    const amount = this.state.scheduledSheep[player.name][round]
    player.addAnimals('sheep', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled sheep',
      args: { player, amount },
    })
    delete this.state.scheduledSheep[player.name][round]
  }

  // Scheduled boar (Acorns Basket)
  if (this.state.scheduledBoar?.[player.name]?.[round]) {
    const amount = this.state.scheduledBoar[player.name][round]
    player.addAnimals('boar', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled wild boar',
      args: { player, amount },
    })
    delete this.state.scheduledBoar[player.name][round]
  }

  // Scheduled plows (Handplow, Chain Float)
  if (this.state.scheduledPlows?.[player.name]?.includes(round)) {
    this.offerScheduledPlow(player)
    this.state.scheduledPlows[player.name] = this.state.scheduledPlows[player.name].filter(r => r !== round)
  }

  // Scheduled stone rooms (Hawktower)
  if (this.state.scheduledStoneRooms?.[player.name]?.includes(round)) {
    this.offerScheduledStoneRoom(player)
    this.state.scheduledStoneRooms[player.name] =
      this.state.scheduledStoneRooms[player.name].filter(r => r !== round)
  }

  // Scheduled free stables (Stable Planner)
  if (this.state.scheduledFreeStables?.[player.name]?.includes(round)) {
    this.actions.buildFreeStable(player)
    this.state.scheduledFreeStables[player.name] =
      this.state.scheduledFreeStables[player.name].filter(r => r !== round)
  }
}

/**
 * Offer player the option to plow a field for food (Plow Driver: 1 food; Shifting Cultivator: 3 food).
 */
Agricola.prototype.offerPlowForFood = function(player, card, foodCost) {
  const cost = foodCost ?? 1
  if (player.food < cost && this.getAnytimeFoodConversionOptions(player).length === 0) {
    return
  }

  const choices = [`Plow 1 field for ${cost} food`, 'Skip']
  const selection = this.actions.choose(player, choices, {
    title: `${card.name}: Plow for food?`,
    min: 1,
    max: 1,
  })

  if (selection[0] !== 'Skip') {
    player.payCost({ food: cost })
    this.actions.plowField(player, { immediate: true })
  }
}

/**
 * Offer player a scheduled plow (Handplow)
 */
Agricola.prototype.offerScheduledPlow = function(player) {
  const choices = ['Plow 1 field (Handplow)', 'Skip']
  const selection = this.actions.choose(player, choices, {
    title: 'Handplow: Plow scheduled field?',
    min: 1,
    max: 1,
  })

  if (selection[0] === 'Plow 1 field (Handplow)') {
    this.actions.plowField(player, { immediate: true })
  }
}

/**
 * Offer player a scheduled free stone room (Hawktower)
 */
Agricola.prototype.offerScheduledStoneRoom = function(player) {
  if (player.roomType !== 'stone') {
    this.log.add({
      template: '{player} discards the Hawktower room (not in stone house)',
      args: { player },
    })
    return
  }

  const validSpaces = player.getValidRoomBuildSpaces()
  if (validSpaces.length === 0) {
    this.log.add({
      template: '{player} has no valid space for the Hawktower room',
      args: { player },
    })
    return
  }

  const choices = ['Build free stone room (Hawktower)', 'Skip']
  const selection = this.actions.choose(player, choices, {
    title: 'Hawktower: Build free stone room?',
    min: 1,
    max: 1,
  })

  if (selection[0] === 'Build free stone room (Hawktower)') {
    const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)

    const selector = {
      type: 'select',
      actor: player.name,
      title: 'Choose where to build the stone room (Hawktower)',
      choices: spaceChoices,
      min: 1,
      max: 1,
      allowsAction: 'build-room',
      validSpaces: validSpaces,
    }

    const result = this.requestInputSingle(selector)

    let row, col
    if (result.action === 'build-room') {
      row = result.row
      col = result.col
    }
    else {
      [row, col] = result[0].split(',').map(Number)
    }

    player.buildRoom(row, col)

    this.log.add({
      template: '{player} builds a free stone room at ({row},{col}) via Hawktower',
      args: { player, row, col },
    })

    this.callPlayerCardHook(player, 'onBuildRoom', 'stone')
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

Agricola.prototype.isNonAccumulatingActionSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    // Card-provided action spaces are non-accumulating
    const state = this.state.actionSpaces[actionId]
    return state && !state.accumulated
  }
  return action.type !== 'accumulating'
}

Agricola.prototype.actionSpaceProvidesStoneAndOther = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }
  const gives = action.gives || {}
  const accumulates = action.accumulates || {}
  const hasStone = gives.stone > 0 || accumulates.stone > 0
  const hasOtherBuilding = gives.wood > 0 || gives.clay > 0 || gives.reed > 0
    || accumulates.wood > 0 || accumulates.clay > 0 || accumulates.reed > 0
  // Also check allowsResourceChoice for spaces like Resource Market
  const hasStoneChoice = action.allowsResourceChoice && action.allowsResourceChoice.includes('stone')
  const hasOtherChoice = action.allowsResourceChoice && action.allowsResourceChoice.some(r => ['wood', 'clay', 'reed'].includes(r))
  return (hasStone || hasStoneChoice) && (hasOtherBuilding || hasOtherChoice)
}

Agricola.prototype.getTotalOccupationsInPlay = function() {
  let count = 0
  for (const player of this.players.all()) {
    count += player.getOccupationCount()
  }
  return count
}

Agricola.prototype.getCompleteStagesLeft = function() {
  // Stages: 1(r1-4), 2(r5-7), 3(r8-9), 4(r10-11), 5(r12-13), 6(r14)
  const stageStartRounds = [1, 5, 8, 10, 12, 14]
  const currentRound = this.state.round
  return stageStartRounds.filter(r => r > currentRound).length
}

Agricola.prototype.isAnimalAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || action.type !== 'accumulating') {
    return false
  }
  const acc = action.accumulates || {}
  return !!(acc.sheep || acc.boar || acc.cattle)
}

Agricola.prototype.actionSpaceGivesFood = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }
  return !!(action.gives && action.gives.food) || !!(action.accumulates && action.accumulates.food)
}

Agricola.prototype.isBuildingResourceAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || action.type !== 'accumulating') {
    return false
  }
  const acc = action.accumulates || {}
  return !!(acc.wood || acc.clay || acc.reed || acc.stone)
}

// getAccumulatedResources already defined above (line 351) with pre-take amount support

Agricola.prototype.allClayAccumulationSpacesUnoccupied = function() {
  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates && action.accumulates.clay) {
      if (this.state.actionSpaces[actionId].occupiedBy) {
        return false
      }
    }
  }
  return true
}

Agricola.prototype.getStoneAccumulationSpacesWithStone = function() {
  let count = 0
  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates && action.accumulates.stone) {
      if (this.state.actionSpaces[actionId].accumulated > 0) {
        count++
      }
    }
  }
  return count
}


////////////////////////////////////////////////////////////////////////////////
// Card Drafting Phase

Agricola.prototype.draftPhase = function() {
  this.log.add({ template: '=== Card Drafting ===' })
  this.log.indent()

  // Draft occupations first (pass left)
  this.log.add({ template: 'Drafting Occupations' })
  this.log.indent()
  this.draftCardType('occupations', 1) // 1 = pass left
  this.log.outdent()

  // Draft minor improvements (pass right)
  this.log.add({ template: 'Drafting Minor Improvements' })
  this.log.indent()
  this.draftCardType('minors', -1) // -1 = pass right
  this.log.outdent()

  this.log.outdent()

  // Log final hands
  for (const player of this.players.all()) {
    const occupations = player.hand.filter(id => {
      const card = this.cards.byId(id)
      return card && card.type === 'occupation'
    })
    const minors = player.hand.filter(id => {
      const card = this.cards.byId(id)
      return card && card.type === 'minor'
    })

    this.log.add({
      template: '{player} drafted {occ} occupations and {minor} minor improvements',
      args: { player, occ: occupations.length, minor: minors.length },
    })
  }

  // Clean up draft state
  delete this.state.draftPools
}

Agricola.prototype.draftCardType = function(cardType, passDirection) {
  const players = this.players.all()
  const playerCount = players.length
  const pools = this.state.draftPools[cardType]
  const cardTypeName = cardType === 'occupations' ? 'Occupation' : 'Minor Improvement'

  // Each player starts with one pool in their queue.
  // As they pick, remaining cards pass to the next player immediately.
  const playerQueues = players.map((_, i) => [pools[i]])
  const totalPicks = pools.reduce((sum, pool) => sum + pool.length, 0)
  let picksMade = 0

  while (picksMade < totalPicks) {
    const playerOptions = []

    for (let i = 0; i < playerCount; i++) {
      if (playerQueues[i].length === 0) {
        continue
      }
      const pool = playerQueues[i][0]
      if (pool.length === 0) {
        continue
      }

      const player = players[i]
      const choices = pool.map(cardId => {
        const card = this.cards.byId(cardId)
        return card ? card.name : cardId
      })

      playerOptions.push({
        actor: player.name,
        title: `Draft ${cardTypeName}`,
        choices,
      })
    }

    if (playerOptions.length === 0) {
      break
    }

    const response = this.requestInputAny(playerOptions)
    const player = this.players.byName(response.actor)
    const playerIndex = players.indexOf(player)
    const pool = playerQueues[playerIndex][0]
    const selectedName = response.selection[0]

    const cardId = pool.find(id => {
      const card = this.cards.byId(id)
      return card && card.name === selectedName
    })

    if (cardId) {
      pool.splice(pool.indexOf(cardId), 1)

      // Move card from supply to player's hand zone
      const card = this.cards.byId(cardId)
      const handZone = this.zones.byPlayer(player, 'hand')
      card.moveTo(handZone)

      picksMade++

      // Record draft pick for stats
      this.stats.draft.picks[cardId] = {
        name: card.name,
        type: card.type,
        setId: card.definition?.deck || 'unknown',
        pickOrder: picksMade,
        pickedBy: player.name,
      }
      this.stats.players[player.name].drafted.push(cardId)

      this.log.add({
        template: '{player} drafts {draftedCard}',
        redacted: '{player} drafts a card',
        visibility: [player.name],
        args: { player, draftedCard: selectedName },
      })

      // Remove this pool from the player's queue
      playerQueues[playerIndex].shift()

      // Pass remaining cards to next player (if any)
      if (pool.length > 0) {
        const nextIndex = (playerIndex + passDirection + playerCount) % playerCount
        playerQueues[nextIndex].push(pool)
      }
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Color Selection

Agricola.prototype.chooseColor = function(player) {
  // Only choose colors for version 2+ games
  if (!this.settings.version || this.settings.version < 2) {
    return
  }

  Game.prototype.chooseColor.call(this, player)
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

Agricola.prototype.replenishPhase = function() {
  this.log.add({ template: 'Replenishing action spaces' })
  this.log.indent()

  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates) {
      const state = this.state.actionSpaces[actionId]

      for (const [, amount] of Object.entries(action.accumulates)) {
        const prevAccumulated = state.accumulated
        state.accumulated += amount

        if (actionId === 'take-reed') {
          const wasNonEmpty = prevAccumulated > 0
          this.callCardHook('onReedBankReplenish', wasNonEmpty)
        }
      }

      if (state.accumulated > 0) {
        this.log.add({
          template: '{action}: {amount} accumulated',
          args: { action: action.name, amount: state.accumulated },
        })
      }
    }
  }

  this.log.outdent()
}

Agricola.prototype.workPhase = function() {
  this.log.add({ template: 'Work phase begins' })
  this.log.indent()

  // Reset all action space occupation
  for (const actionId of this.state.activeActions) {
    this.state.actionSpaces[actionId].occupiedBy = null
  }

  this.callCardHook('onWorkPhaseStart')

  // Reset per-round tracking
  for (const player of this.players.all()) {
    player.usedFishingThisRound = false
    player.resourcesGainedThisRound = {}
    player._firstActionThisRound = null
    player._usedMummysBoyDoubleAction = false
    player.usedAccumulationSpaceTypes = undefined // Patch Caretaker: same good-type tracking per work phase
  }

  let currentPlayerIndex = this.players.all().findIndex(p => p.name === this.state.startingPlayer)

  // Work phase continues until no player has available workers
  while (true) {
    // Find next player with available workers
    const playerList = this.players.all()
    let attempts = 0

    while (attempts < playerList.length) {
      const player = playerList[currentPlayerIndex]

      if (player.getAvailableWorkers() > 0) {
        // Exclude newborns from worker count (they can't work this round)
        const newbornCount = player.getNewbornsReturningHome()
        const workersThatCanWork = player.getFamilySize() - newbornCount
        const workersUsed = workersThatCanWork - player.getAvailableWorkers() + 1
        const totalWorkerCount = workersThatCanWork
        this.log.add({
          template: "{player}'s turn ({workersUsed}/{totalWorkers})",
          args: { player, workersUsed, totalWorkers: totalWorkerCount },
        })
        this.log.indent()
        this.playerTurn(player)
        this.log.outdent()

        // BasketChair: if player moved first person, they get a bonus turn
        if (this.state.basketChairBonusTurn === player.name) {
          this.state.basketChairBonusTurn = null
          this.log.add({
            template: "{player}'s bonus turn (Basket Chair)",
            args: { player },
          })
          this.log.indent()
          this.playerTurn(player, { isBonusTurn: true })
          this.log.outdent()
        }

        // BrotherlyLove: 4 people, after 2nd person → 3rd and 4th back-to-back
        if (this.canUseBrotherlyLove(player)) {
          this.log.add({
            template: '{player} places 3rd and 4th person back-to-back (Brotherly Love)',
            args: { player },
          })
          // 3rd person
          this.log.indent()
          this.playerTurn(player, { isBonusTurn: true })
          this.log.outdent()
          const lastActionId = player._lastActionId
          // 4th person — can use same space as 3rd
          this.log.indent()
          this.playerTurn(player, { isBonusTurn: true, allowSameSpaceAs: lastActionId })
          this.log.outdent()
        }

        break
      }
      else if (this.canUseAdoptiveParents(player)) {
        // Player has no workers but can adopt a newborn (Adoptive Parents card)
        const choices = ['Adopt newborn (1 food)', 'Pass']
        const selection = this.actions.choose(player, choices, {
          title: 'Adoptive Parents: Take action with newborn?',
          min: 1,
          max: 1,
        })

        if (selection[0] === 'Adopt newborn (1 food)') {
          player.adoptNewborn()
          this.log.add({
            template: '{player} uses Adoptive Parents (pays 1 food)',
            args: { player },
          })
          this.log.indent()
          this.playerTurn(player)
          this.log.outdent()
          break
        }
        // If they pass, continue to next player
      }
      else if (this.canUseGuestRoom(player)) {
        const choices = ['Use Guest Room (1 food from card)', 'Pass']
        const selection = this.actions.choose(player, choices, {
          title: 'Guest Room: Place a guest worker?',
          min: 1,
          max: 1,
        })

        if (selection[0] === 'Use Guest Room (1 food from card)') {
          const card = this._getGuestRoomCard(player)
          const state = this.cardState(card.id)
          state.food -= 1
          state.lastUsedRound = this.state.round
          this.log.add({
            template: '{player} uses Guest Room (discards 1 food from card)',
            args: { player },
          })
          this.log.indent()
          this.playerTurn(player, { skipUseWorker: true })
          this.log.outdent()
          break
        }
      }
      else if (this.canUseWorkPermit(player)) {
        const entry = this.state.workPermitWorkers.find(
          e => e.round === this.state.round && e.playerName === player.name
        )
        this.state.workPermitWorkers = this.state.workPermitWorkers.filter(e => e !== entry)
        this.log.add({
          template: '{player} uses scheduled worker (Work Permit)',
          args: { player },
        })
        this.log.indent()
        this.playerTurn(player, { skipUseWorker: true })
        this.log.outdent()
        break
      }

      currentPlayerIndex = (currentPlayerIndex + 1) % playerList.length
      attempts++
    }

    if (attempts >= playerList.length) {
      // No players have workers left (and none can adopt newborns)
      break
    }

    // Move to next player
    currentPlayerIndex = (currentPlayerIndex + 1) % playerList.length
  }

  // Call onWorkPhaseEnd per-player with lastActionId (e.g., Steam Machine bake bread)
  for (const player of this.players.all()) {
    this.callPlayerCardHook(player, 'onWorkPhaseEnd', player._lastActionId)
  }

  // Archway: after all workers placed, the archway user gets an extra action
  if (this.state.archwayPlayer) {
    const archwayPlayer = this.players.byName(this.state.archwayPlayer)
    this.state.archwayPlayer = null

    // Get unoccupied action spaces (exclude card-provided action spaces)
    const available = this.getAvailableActions(archwayPlayer, { excludeCardSpaces: true })
    if (available.length > 0) {
      const choices = available.map(actionId => {
        const action = res.getActionById(actionId)
        const state = this.state.actionSpaces[actionId]
        const name = action ? action.name : state.name
        return { id: actionId, label: name }
      })
      choices.push({ id: 'skip', label: 'Skip extra action' })

      const selectorChoices = choices.map(c => c.label)
      const selection = this.actions.choose(
        archwayPlayer,
        selectorChoices,
        { title: 'Archway: Choose an unoccupied action space', min: 1, max: 1 }
      )

      const selectedChoice = choices.find(c => c.label === selection[0])
      if (selectedChoice && selectedChoice.id !== 'skip') {
        const actionId = selectedChoice.id
        this.state.actionSpaces[actionId].occupiedBy = archwayPlayer.name
        this.log.add({
          template: '{player} uses Archway to take extra action: {action}',
          args: { player: archwayPlayer, action: selectedChoice.label },
        })
        this.actions.executeAction(archwayPlayer, actionId)
      }
    }
  }

  this.log.outdent()
}

Agricola.prototype.playerTurn = function(player, options) {
  // Choose color on first turn if not already set
  this.chooseColor(player)

  // Reset per-turn tracking for Cookery Lesson
  player._usedCookingThisTurn = false

  const availableActions = this.getAvailableActions(player, options)

  if (availableActions.length === 0) {
    this.log.add({
      template: '{player} has no available actions',
      args: { player },
    })
    return
  }

  // Build choice list
  const choices = availableActions.map(actionId => {
    const action = res.getActionById(actionId)
    const state = this.state.actionSpaces[actionId]

    const name = action ? action.name : state.name
    const choice = { id: actionId, label: name }
    if (action && action.type === 'accumulating' && state.accumulated > 0) {
      choice.detail = `${state.accumulated}`
    }
    return choice
  })

  // Sort alphabetically by label (only for version 3+)
  if (this.settings.version >= 3) {
    choices.sort((a, b) => a.label.localeCompare(b.label))
  }

  // Check for cards that modify worker placement (SourDough, WoodSaw, JobContract)
  const specialChoices = this._getSpecialPlacementChoices(player)
  for (const special of specialChoices) {
    choices.push(special)
  }

  const selectorChoices = choices.map(c => {
    if (c.detail) {
      return { title: c.label, detail: c.detail }
    }
    return c.label
  })

  const selection = this.actions.choose(
    player,
    selectorChoices,
    { title: 'Choose an action', min: 1, max: 1 }
  )

  // Find the selected action
  const selectedLabel = selection[0]
  const selectedChoice = choices.find(c => c.label === selectedLabel)

  // Handle special placement choices (no worker used or combined actions)
  if (selectedChoice && selectedChoice.special) {
    this._executeSpecialPlacement(player, selectedChoice)
    return
  }

  if (selectedChoice) {
    const actionId = selectedChoice.id
    const state = this.state.actionSpaces[actionId]
    const wasAlreadyOccupiedByUs = state.occupiedBy === player.name

    // Track previous occupier before overwriting (used by ParrotBreeder)
    state.previousOccupiedBy = state.occupiedBy

    // Mark action as occupied
    state.occupiedBy = player.name

    // Track last action for onWorkPhaseEnd hooks (e.g., Steam Machine)
    player._lastActionId = actionId

    // Track first action for BasketChair
    if (!player._firstActionThisRound) {
      player._firstActionThisRound = actionId
    }

    // Track fishing for card hooks
    if (actionId === 'fishing') {
      player.usedFishingThisRound = true
    }

    // Use a worker (skip for GuestRoom/WorkPermit bonus workers)
    if (!options?.skipUseWorker) {
      player.useWorker()
    }

    // Track which person number was placed here (used by SecondSpouse)
    state.personNumber = player.getPersonPlacedThisRound()

    // Call onBeforeAction hooks (e.g., Trellis builds fences before Pig Market)
    this.callPlayerCardHook(player, 'onBeforeAction', actionId)

    // Record unused spaces before action for onUseMultipleSpaces hook
    const unusedBefore = player.getUnusedSpaceCount()

    // Execute the action
    this.actions.executeAction(player, actionId)

    // Check if unused spaces were converted to used spaces
    const spacesUsed = unusedBefore - player.getUnusedSpaceCount()
    for (let i = 0; i < spacesUsed; i++) {
      this.callPlayerCardHook(player, 'onUseSpace')
    }
    if (spacesUsed >= 1) {
      this.callPlayerCardHook(player, 'onUseFarmyardSpace')
    }
    if (spacesUsed >= 2) {
      this.callPlayerCardHook(player, 'onUseMultipleSpaces', spacesUsed)
    }

    // Fire afterPlayerAction hook (not during bonus turns to prevent recursion)
    if (!options?.isBonusTurn) {
      this.callPlayerCardHook(player, 'afterPlayerAction', actionId)
    }

    // Check for unused once-per-round anytime actions
    if (!options?.isBonusTurn) {
      const unusedActions = this.getUnusedOncePerRoundActions(player)
      if (unusedActions.length > 0) {
        this.actions.choose(player, ['End turn'], {
          title: 'You have unused once-per-turn actions.',
          anytimeActions: unusedActions,
          noAutoRespond: true,
        })
      }
    }

    // Check for Cookery Lesson: Lessons action + cooking on same turn
    const isLessonsAction = actionId === 'occupation' || actionId.startsWith('lessons-')
    if (isLessonsAction && player._usedCookingThisTurn) {
      this.callPlayerCardHook(player, 'onLessonsWithCooking')
    }

    // Mummy's Boy: mark once-per-round double action as used
    if (wasAlreadyOccupiedByUs) {
      for (const card of player.getActiveCards()) {
        if (card.allowsDoubleAction) {
          player._usedMummysBoyDoubleAction = true
          break
        }
      }
    }
  }
}

Agricola.prototype._getSpecialPlacementChoices = function(player) {
  const choices = []
  const cards = this.getPlayerActiveCards(player)

  for (const card of cards) {
    const mod = card.definition.modifiesWorkerPlacement
    if (!mod) {
      continue
    }

    if (mod === 'sourDough') {
      // SourDough: skip placement and bake bread instead (once per round)
      const state = this.cardState(card.id)
      if (state.lastUsedRound === this.state.round) {
        continue
      }
      if (!player.hasBakingAbility()) {
        continue
      }
      if (player.grain < 1) {
        continue
      }
      // All players must have at least 1 worker remaining
      const allHaveWorkers = this.players.all().every(p => p.getAvailableWorkers() >= 1)
      if (!allHaveWorkers) {
        continue
      }
      choices.push({
        id: 'sour-dough-bake',
        label: 'Bake Bread (Sour Dough)',
        special: 'sourDough',
        cardId: card.id,
      })
    }

    if (mod === 'woodSaw') {
      // WoodSaw: free Build Rooms when all others have more workers (family members)
      const allOthersHaveMore = this.players.all()
        .filter(p => p.name !== player.name)
        .every(p => p.getFamilySize() > player.getFamilySize())
      if (!allOthersHaveMore) {
        continue
      }
      // Check player can actually build rooms
      if (player.getValidRoomBuildSpaces().length === 0) {
        continue
      }
      if (!player.canAffordRoom()) {
        continue
      }
      choices.push({
        id: 'wood-saw-build',
        label: 'Build Rooms (Wood Saw)',
        special: 'woodSaw',
        cardId: card.id,
      })
    }

    if (mod === 'teaHouse') {
      // TeaHouse: skip 2nd placement, get 1 food (once per round)
      const state = this.cardState(card.id)
      if (state.lastUsedRound === this.state.round) {
        continue
      }
      if (player.getPersonPlacedThisRound() !== 1) {
        continue
      }
      choices.push({
        id: 'tea-house-skip',
        label: 'Skip placement (Tea House)',
        special: 'teaHouse',
        cardId: card.id,
      })
    }

    if (mod === 'jobContract') {
      // JobContract: combine Day Laborer + Lessons when both unoccupied
      const dlState = this.state.actionSpaces['day-laborer']
      const lessonsState = this.state.actionSpaces['occupation']
      if (!dlState || dlState.occupiedBy) {
        continue
      }
      if (!lessonsState || lessonsState.occupiedBy) {
        continue
      }
      choices.push({
        id: 'job-contract-combined',
        label: 'Day Laborer + Lessons (Job Contract)',
        special: 'jobContract',
        cardId: card.id,
      })
    }
  }

  return choices
}

Agricola.prototype._executeSpecialPlacement = function(player, choice) {
  if (choice.special === 'sourDough') {
    // Skip placement, bake bread instead
    this.cardState(choice.cardId).lastUsedRound = this.state.round
    this.log.add({
      template: '{player} skips placement and bakes bread (Sour Dough)',
      args: { player },
    })
    this.actions.bakeBread(player)
    return
  }

  if (choice.special === 'woodSaw') {
    // Free Build Rooms action — no worker used, no action space occupied
    this.log.add({
      template: '{player} takes Build Rooms without placing a person (Wood Saw)',
      args: { player },
    })
    this.actions.buildRoom(player)
    return
  }

  if (choice.special === 'teaHouse') {
    // Skip placement, get 1 food — worker NOT used, placed later naturally
    this.cardState(choice.cardId).lastUsedRound = this.state.round
    player.addResource('food', 1)
    this.log.add({
      template: '{player} skips placement and gets 1 food (Tea House)',
      args: { player },
    })
    return
  }

  if (choice.special === 'jobContract') {
    // Combined Day Laborer + Lessons — one worker, both spaces occupied
    this.state.actionSpaces['day-laborer'].occupiedBy = player.name
    this.state.actionSpaces['occupation'].occupiedBy = player.name
    player.useWorker()
    this.log.add({
      template: '{player} uses Job Contract: Day Laborer + Lessons',
      args: { player },
    })
    this.actions.executeAction(player, 'day-laborer')
    this.actions.executeAction(player, 'occupation')
    return
  }
}

Agricola.prototype.getAvailableActions = function(player, options) {
  const available = []

  for (const actionId of this.state.activeActions) {
    const state = this.state.actionSpaces[actionId]

    // Skip card-provided action spaces if requested (e.g., Archway extra action)
    if (options?.excludeCardSpaces && state.cardProvided) {
      continue
    }

    // Action must not be occupied (unless a card overrides this or options.allowOccupied)
    if (state.occupiedBy) {
      // BrotherlyLove: 4th person can use same space as 3rd
      if (options?.allowSameSpaceAs === actionId && state.occupiedBy === player.name) {
        // Allow through
      }
      else if (!options?.allowOccupied && !this.playerCanUseOccupiedSpace(player, actionId, state)) {
        continue
      }
    }

    // Action must not be blocked by linked space
    if (state.blockedBy) {
      continue
    }

    // Check if player can meaningfully take this action
    // (some actions might have prerequisites)
    if (this.canTakeAction(player, actionId)) {
      available.push(actionId)
    }
  }

  // Created action spaces (e.g. Forest Tallyman gap when Forest and Clay Pit occupied)
  for (const card of player.getActiveCards()) {
    const def = card.definition
    if (!def.createsActionSpace || typeof def.actionSpaceAvailable !== 'function') {
      continue
    }
    if (!def.actionSpaceAvailable(this)) {
      continue
    }
    const id = def.createsActionSpace
    if (available.includes(id)) {
      continue
    }
    if (!this.state.actionSpaces[id]) {
      this.state.actionSpaces[id] = {
        occupiedBy: null,
        cardProvided: true,
        cardId: def.id,
        ownerName: player.name,
        name: def.name + ' (gap)',
        description: def.text,
        ownerOnly: true,
      }
    }
    if (!this.state.actionSpaces[id].occupiedBy) {
      available.push(id)
    }
  }

  if (options?.allowedActions) {
    return available.filter(id => options.allowedActions.includes(id))
  }

  if (options?.excludeMeetingPlace) {
    return available.filter(id => id !== 'starting-player')
  }

  return available
}

Agricola.prototype.playerCanUseOccupiedSpace = function(player, actionId, state) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }

  for (const card of player.getActiveCards()) {
    if (card.hasHook('canUseOccupiedActionSpace')) {
      if (card.callHook('canUseOccupiedActionSpace', this, player, actionId, action, state)) {
        return true
      }
    }
    if (card.hasHook('allowsIgnoreOccupied')) {
      if (card.callHook('allowsIgnoreOccupied', player, actionId, this)) {
        return true
      }
    }
  }

  return false
}

Agricola.prototype.canTakeAction = function(player, actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    const state = this.state.actionSpaces[actionId]
    if (!state?.cardProvided) {
      return false
    }
    if (state.ownerOnly && state.ownerName !== player.name) {
      return false
    }
    const card = this.cards.byId(state.cardId)
    const owner = this.players.byName(state.ownerName)
    if (card.hasHook('canUseActionSpace') && !card.callHook('canUseActionSpace', this, player, owner)) {
      return false
    }
    return true
  }

  // Check minimum round requirement (e.g., Modest Wish for Children)
  if (action.minRound && this.state.round < action.minRound) {
    return false
  }

  // Family growth actions have prerequisites
  if (action.allowsFamilyGrowth) {
    // Check card-based growth restrictions (e.g., Visionary)
    for (const card of this.getPlayerActiveCards(player)) {
      if (card.hasHook('canGrowFamily') && !card.callHook('canGrowFamily', player, this)) {
        return false
      }
    }

    if (action.requiresRoom !== false) {
      // Standard family growth - needs room
      if (!player.canGrowFamily(true)) {
        // Check if any card allows growth without room (e.g., FieldDoctor, DeliveryNurse)
        let allowedByCard = false
        for (const card of this.getPlayerActiveCards(player)) {
          if (card.hasHook('allowsFamilyGrowthWithoutRoom') &&
              card.callHook('allowsFamilyGrowthWithoutRoom', this, player)) {
            allowedByCard = true
            break
          }
        }
        if (!allowedByCard) {
          return false
        }
      }
    }
    else {
      // Urgent family growth - no room needed
      if (!player.canGrowFamily(false)) {
        return false
      }
    }
  }

  // Most actions can always be taken (even if the player can't afford to do anything)
  return true
}

Agricola.prototype.registerCardActionSpace = function(player, card) {
  const def = card.definition
  if (!def.providesActionSpace || !def.actionSpaceId) {
    return
  }

  const id = def.actionSpaceId
  this.state.activeActions.push(id)
  this.state.actionSpaces[id] = {
    occupiedBy: null,
    cardProvided: true,
    cardId: def.id,
    ownerName: player.name,
    name: def.name,
    description: def.text,
    ownerOnly: def.ownerOnly || false,
  }

  this.log.add({
    template: '{player} adds {card} as an action space',
    args: { player, card },
  })
}

Agricola.prototype.returnHomePhase = function() {
  this.log.add({ template: 'Workers return home' })

  // Call onReturnHome hooks before resetting workers
  this.callReturnHomeHooks()

  for (const player of this.players.all()) {
    player.resetWorkers()
  }

  // Clear all blocked states from linked spaces
  for (const actionId of this.state.activeActions) {
    if (this.state.actionSpaces[actionId].blockedBy) {
      delete this.state.actionSpaces[actionId].blockedBy
    }
  }

  // Clear created action spaces (e.g. Forest Tallyman gap) so they can appear again next round
  for (const player of this.players.all()) {
    for (const card of player.getActiveCards()) {
      const def = card.definition
      if (def.createsActionSpace && this.state.actionSpaces[def.createsActionSpace]) {
        this.state.actionSpaces[def.createsActionSpace].occupiedBy = null
      }
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Harvest Phase

Agricola.prototype.harvestPhase = function() {
  this.log.add({ template: '=== Harvest ===' })
  this.log.indent()

  // Call onHarvestStart and onBeforeHarvest hooks (e.g., Lunchtime Beer, Haydryer)
  this.state.skipField = []
  this.state.skipFeeding = []
  this.state.skipBreeding = []
  for (const player of this.players.all()) {
    this.callPlayerCardHook(player, 'onHarvestStart')
    this.callPlayerCardHook(player, 'onBeforeHarvest')

    // Consume skipNextHarvest flag (Layabout: skip entire harvest)
    if (player.skipNextHarvest) {
      this.state.skipField.push(player.name)
      this.state.skipFeeding.push(player.name)
      this.state.skipBreeding.push(player.name)
      delete player.skipNextHarvest
      this.log.add({
        template: '{player} skips the harvest',
        args: { player },
      })
    }
  }

  this.fieldPhase()
  this.feedingPhase()
  this.breedingPhase()

  // Clean up skip flags
  delete this.state.skipField
  delete this.state.skipFeeding
  delete this.state.skipBreeding

  // Call onHarvestEnd hooks (e.g., ValueAssets offers to buy building resources)
  this.callCardHook('onHarvestEnd')

  // Revised Edition rule:
  // - During breeding phase, you cannot eat/exchange animals
  // - After breeding in rounds 4, 7, 9, 11, 13: eating/exchanging IS allowed before next round
  // - After breeding in round 14: game ends IMMEDIATELY, no cooking allowed
  const isFinalHarvest = this.state.round === res.constants.totalRounds

  if (!isFinalHarvest) {
    // Allow optional cooking/exchanging after breeding (non-final harvest only)
    this.postBreedingPhase()
  }
  else {
    this.log.add({ template: 'Final harvest complete - game ends immediately' })
  }

  this.log.outdent()
}

Agricola.prototype.fieldPhase = function() {
  this.log.add({ template: 'Field Phase: Harvesting crops' })
  this.log.indent()

  // Record last harvest round for Dutch Windmill
  this.state.lastHarvestRound = this.state.round

  // Snapshot goods in fields before final harvest (for Wood Rake)
  if (this.state.round === 14) {
    for (const player of this.players.all()) {
      player.goodsInFieldsBeforeFinalHarvest = player.getTotalGoodsInFields()
    }
  }

  for (const player of this.players.all()) {
    if (this.state.skipField?.includes(player.name)) {
      continue
    }

    // Call onBeforeFieldPhase hooks (e.g., Straw Manure adds vegetables before harvest)
    this.callPlayerCardHook(player, 'onBeforeFieldPhase')

    // Give players with crop-move ability a chance to rearrange before harvest
    const anytimeActions = this.getAnytimeActions(player)
    const hasCropMove = anytimeActions.some(a => a.type === 'crop-move')
    if (hasCropMove) {
      this.actions.choose(player, ['Harvest crops'], {
        title: 'Use anytime actions before harvest?',
        min: 1, max: 1,
      })
    }

    const result = player.harvestFields()
    const harvested = result.harvested

    if (harvested.grain > 0 || harvested.vegetables > 0 || harvested.wood > 0) {
      this.log.add({
        template: '{player} harvests {grain} grain, {veg} vegetables, and {wood} wood',
        args: { player, grain: harvested.grain, veg: harvested.vegetables, wood: harvested.wood },
      })
    }

    if (harvested.grain > 0) {
      this.callPlayerCardHook(player, 'onHarvestGrain', harvested.grain)
    }
    if (harvested.vegetables > 0) {
      this.callPlayerCardHook(player, 'onHarvestVegetables', harvested.vegetables)
    }

    // Process virtual field callbacks
    for (const vfh of result.virtualFieldHarvests) {
      // onHarvest callback (e.g., Artichoke Field gives food per harvest)
      if (vfh.onHarvest) {
        const card = this.cards.byId(vfh.cardId)
        if (card && card.definition.onHarvest) {
          card.definition.onHarvest(this, player, vfh.amount)
        }
      }

      // onHarvestLast callback (e.g., Cherry Orchard gives vegetable)
      if (vfh.isLast && vfh.onHarvestLast) {
        const card = this.cards.byId(vfh.cardId)
        if (card && card.definition.onHarvestLast) {
          card.definition.onHarvestLast(this, player, vfh.crop)
        }
      }
    }

    // Call onHarvestLastCrop hooks for fields that became empty (e.g., Slurry Spreader)
    if (result.lastCropHarvests) {
      for (const cropType of result.lastCropHarvests) {
        this.callPlayerCardHook(player, 'onHarvestLastCrop', cropType)
      }
    }

    // Call onFieldPhase hooks (e.g., Scythe harvests all from one field)
    this.callPlayerCardHook(player, 'onFieldPhase')
  }

  // Call onHarvest hooks (e.g., Scythe Worker gives bonus grain)
  this.callHarvestHooks()

  this.callCardHook('onFieldPhaseEnd')

  this.log.outdent()
}

Agricola.prototype.feedingPhase = function() {
  this.log.add({ template: 'Feeding Phase' })
  this.log.indent()

  for (const player of this.players.all()) {
    if (this.state.skipFeeding?.includes(player.name)) {
      continue
    }

    const required = player.getFoodRequired()

    this.log.add({
      template: '{player} needs {food} food',
      args: { player, food: required },
    })

    this.callPlayerCardHook(player, 'onFeedingPhase')

    // If the player has anytime actions and already enough food,
    // give them a chance to use anytime actions before feeding
    const hasAnytimeActions = this.getAnytimeActions(player).length > 0
    if (hasAnytimeActions && player.food >= required) {
      this.actions.choose(player, ['Feed family'], {
        title: `Feed family (${player.food}/${required} food)`,
        min: 1, max: 1,
      })
    }

    // Allow player to convert resources to food (optional)
    // Revised Edition rule: Players can withhold other goods (grain, vegetables, animals)
    // but cannot withhold food tokens. feedFamily() automatically uses all food tokens.
    this.allowFoodConversion(player, required)

    // Feed the family
    // Revised Edition rule: All food tokens are automatically used before taking begging cards.
    // Players cannot intentionally withhold food tokens to beg more than necessary.
    const result = player.feedFamily()

    if (result.beggingCards > 0) {
      this.log.add({
        template: '{player} takes {count} begging cards',
        args: { player, count: result.beggingCards },
      })
    }
    else {
      this.log.add({
        template: '{player} feeds their family',
        args: { player },
      })
    }

    this.callPlayerCardHook(player, 'onFeedingPhaseEnd')
  }

  this.log.outdent()
}

Agricola.prototype.allowFoodConversion = function(player, required) {
  while (player.food < required) {
    // Use function wrapper so options are recalculated after anytime actions
    const getOptions = () => {
      const options = this.getAnytimeFoodConversionOptions(player)

      // Add crafting improvements (harvest-only conversions)
      for (const impId of player.majorImprovements) {
        const imp = this.cards.byId(impId)
        if (imp && imp.abilities && imp.abilities.harvestConversion) {
          const conv = imp.abilities.harvestConversion
          if (player[conv.resource] > 0) {
            options.push({
              type: 'craft',
              improvement: imp.name,
              resource: conv.resource,
              count: 1,
              food: conv.food,
              description: `Use ${imp.name}: convert ${conv.resource} to ${conv.food} food`,
            })
          }
        }
      }

      return options
    }

    const options = getOptions()
    if (options.length === 0) {
      break // No more conversion options
    }

    // Build choice strings with function wrapper so they refresh after anytime actions
    const choicesFn = () => {
      const currentOptions = getOptions()
      const choices = currentOptions.map(opt => opt.description)
      choices.push('Done converting')
      return choices
    }

    const selection = this.actions.choose(player, choicesFn, {
      title: `Need ${required - player.food} more food`,
      min: 1,
      max: 1,
    })

    const choice = selection[0]

    if (choice === 'Done converting') {
      break
    }

    // Find the matching option and execute it
    const currentOptions = getOptions()
    const selectedOption = currentOptions.find(opt => opt.description === choice)
    if (selectedOption) {
      this.executeAnytimeFoodConversion(player, selectedOption)
    }
  }
}

Agricola.prototype.breedingPhase = function() {
  this.log.add({ template: 'Breeding Phase' })
  this.log.indent()

  const newbornTypesMap = new Map()

  for (const player of this.players.all()) {
    if (this.state.skipBreeding?.includes(player.name)) {
      continue
    }

    this.callPlayerCardHook(player, 'onBreedingPhaseStart')

    const bred = player.breedAnimals()

    const newbornTypes = (bred.sheep > 0 ? 1 : 0) + (bred.boar > 0 ? 1 : 0) + (bred.cattle > 0 ? 1 : 0)
    newbornTypesMap.set(player.name, newbornTypes)

    const totalBred = bred.sheep + bred.boar + bred.cattle
    if (totalBred > 0) {
      const parts = []
      if (bred.sheep > 0) {
        parts.push('1 sheep')
      }
      if (bred.boar > 0) {
        parts.push('1 boar')
      }
      if (bred.cattle > 0) {
        parts.push('1 cattle')
      }

      this.log.add({
        template: '{player} breeds: {animals}',
        args: { player, animals: parts.join(', ') },
      })
    }
  }

  // Call onBreedingPhaseEnd hooks (e.g., Feedyard food from unused spots, Slurry sow action)
  for (const player of this.players.all()) {
    const newbornTypes = newbornTypesMap.get(player.name) || 0
    this.callPlayerCardHook(player, 'onBreedingPhaseEnd', newbornTypes)
  }

  this.log.outdent()
}

// Revised Edition: After breeding (non-final harvest only), players may cook/exchange animals
Agricola.prototype.postBreedingPhase = function() {
  for (const player of this.players.all()) {
    // Only offer cooking if player has cooking ability and animals
    if (!player.hasCookingAbility()) {
      continue
    }

    const animals = player.getAllAnimals()
    const hasAnimals = animals.sheep > 0 || animals.boar > 0 || animals.cattle > 0

    if (!hasAnimals) {
      continue
    }

    // Only offer cooking if the player has more animals than they can house
    const hasOverflow = ['sheep', 'boar', 'cattle'].some(type => {
      return player.getTotalAnimals(type) > player.getTotalAnimalCapacity(type)
    })

    if (!hasOverflow) {
      continue
    }

    // Offer optional cooking
    let wantsToCook = true
    while (wantsToCook) {
      const options = []

      const currentAnimals = player.getAllAnimals()
      if (currentAnimals.sheep > 0) {
        options.push('Cook 1 sheep')
      }
      if (currentAnimals.boar > 0) {
        options.push('Cook 1 boar')
      }
      if (currentAnimals.cattle > 0) {
        options.push('Cook 1 cattle')
      }

      if (options.length === 0) {
        break
      }

      options.push('Done cooking')

      const selection = this.actions.choose(player, options, {
        title: 'Cook animals after breeding? (optional)',
        min: 1,
        max: 1,
      })

      const choice = selection[0]

      if (choice === 'Done cooking') {
        wantsToCook = false
      }
      else if (choice === 'Cook 1 sheep') {
        const food = player.cookAnimal('sheep', 1)
        this.log.add({
          template: '{player} cooks 1 sheep for {food} food',
          args: { player, food },
        })
      }
      else if (choice === 'Cook 1 boar') {
        const food = player.cookAnimal('boar', 1)
        this.log.add({
          template: '{player} cooks 1 boar for {food} food',
          args: { player, food },
        })
      }
      else if (choice === 'Cook 1 cattle') {
        const food = player.cookAnimal('cattle', 1)
        this.log.add({
          template: '{player} cooks 1 cattle for {food} food',
          args: { player, food },
        })
      }
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Helper Methods

function formatExchange(from, to) {
  const fromStr = Object.entries(from).map(([r, a]) => `${a} ${r}`).join(' + ')
  const toStr = Object.entries(to).map(([r, a]) => `${a} ${r}`).join(' + ')
  return `${fromStr} → ${toStr}`
}

function canAffordCost(player, cost) {
  return Object.entries(cost).every(([res, amt]) => {
    if (['sheep', 'boar', 'cattle'].includes(res)) {
      return player.getTotalAnimals(res) >= amt
    }
    return (player[res] || 0) >= amt
  })
}

Agricola.prototype.getAnytimeFoodConversionOptions = function(player) {
  const options = []

  // Basic conversions (always available, 1:1 ratio)
  if (player.grain > 0) {
    options.push({
      type: 'basic',
      resource: 'grain',
      count: 1,
      food: 1,
      description: 'Convert 1 grain to 1 food',
    })
  }
  if (player.vegetables > 0) {
    options.push({
      type: 'basic',
      resource: 'vegetables',
      count: 1,
      food: 1,
      description: 'Convert 1 vegetable to 1 food',
    })
  }

  // Cooking conversions (requires Fireplace or Cooking Hearth)
  if (player.hasCookingAbility()) {
    const imp = player.getCookingImprovement()
    const rates = imp.abilities.cookingRates
    const animals = player.getAllAnimals()

    for (const [type, count] of Object.entries(animals)) {
      if (count > 0) {
        const food = rates[type]
        options.push({
          type: 'cook',
          resource: type,
          count: 1,
          food,
          description: `Cook 1 ${type} for ${food} food`,
        })
      }
    }

    // Cook vegetables at improvement rate (better than basic 1:1)
    if (player.vegetables > 0) {
      const food = rates.vegetables
      options.push({
        type: 'cook-vegetable',
        resource: 'vegetables',
        count: 1,
        food,
        description: `Cook 1 vegetable for ${food} food`,
      })
    }
  }

  // Card-based anytime conversions (e.g., Oriental Fireplace)
  for (const cardId of player.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (!card || !card.definition.anytimeConversions) {
      continue
    }
    for (const conv of card.definition.anytimeConversions) {
      if (['sheep', 'boar', 'cattle'].includes(conv.from)) {
        if (player.getTotalAnimals(conv.from) > 0) {
          options.push({
            type: 'card-cook',
            cardName: card.name,
            resource: conv.from,
            count: 1,
            food: conv.rate,
            description: `${card.name}: ${conv.from} → ${conv.rate} food`,
          })
        }
      }
      else {
        const resourceKey = conv.from
        if ((player[resourceKey] || 0) > 0) {
          options.push({
            type: 'card-convert',
            cardName: card.name,
            resource: resourceKey,
            count: 1,
            food: conv.rate,
            description: `${card.name}: ${resourceKey} → ${conv.rate} food`,
          })
        }
      }
    }
  }

  // Scan occupations for anytimeConversions (old format) and allowsAnytimeConversion (new format)
  for (const cardId of player.playedOccupations) {
    const card = this.cards.byId(cardId)
    if (!card) {
      continue
    }
    const def = card.definition

    if (def.anytimeConversions) {
      for (const conv of def.anytimeConversions) {
        if (['sheep', 'boar', 'cattle'].includes(conv.from)) {
          if (player.getTotalAnimals(conv.from) > 0) {
            options.push({
              type: 'card-cook',
              cardName: card.name,
              resource: conv.from,
              count: 1,
              food: conv.rate,
              description: `${card.name}: ${conv.from} → ${conv.rate} food`,
            })
          }
        }
        else {
          const resourceKey = conv.from
          if ((player[resourceKey] || 0) > 0) {
            options.push({
              type: 'card-convert',
              cardName: card.name,
              resource: resourceKey,
              count: 1,
              food: conv.rate,
              description: `${card.name}: ${resourceKey} → ${conv.rate} food`,
            })
          }
        }
      }
    }

    if (def.allowsAnytimeConversion) {
      const conversions = Array.isArray(def.allowsAnytimeConversion)
        ? def.allowsAnytimeConversion
        : [def.allowsAnytimeConversion]
      for (const conv of conversions) {
        if (!conv.to.food) {
          continue
        }
        if (!canAffordCost(player, conv.from)) {
          continue
        }
        const fromEntries = Object.entries(conv.from)
        const resource = fromEntries[0][0]
        const count = fromEntries[0][1]
        options.push({
          type: 'card-convert',
          cardName: card.name,
          resource,
          count,
          food: conv.to.food,
          description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
        })
      }
    }
  }

  // Scan minor improvements for allowsAnytimeConversion (new format, food output only)
  for (const cardId of player.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (!card) {
      continue
    }
    const def = card.definition
    if (!def.allowsAnytimeConversion) {
      continue
    }

    const conversions = Array.isArray(def.allowsAnytimeConversion)
      ? def.allowsAnytimeConversion
      : [def.allowsAnytimeConversion]
    for (const conv of conversions) {
      if (!conv.to.food) {
        continue
      }
      if (!canAffordCost(player, conv.from)) {
        continue
      }
      const fromEntries = Object.entries(conv.from)
      const resource = fromEntries[0][0]
      const count = fromEntries[0][1]
      options.push({
        type: 'card-convert',
        cardName: card.name,
        resource,
        count,
        food: conv.to.food,
        description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
      })
    }
  }

  return options
}

Agricola.prototype.executeAnytimeFoodConversion = function(player, option) {
  if (option.type === 'basic') {
    player.convertToFood(option.resource, option.count)
    this.log.add({
      template: '{player} converts {count} {resource} to {food} food',
      args: { player, count: option.count, resource: option.resource, food: option.food },
    })
  }
  else if (option.type === 'cook') {
    player._usedCookingThisTurn = true
    const food = player.cookAnimal(option.resource, option.count)
    this.log.add({
      template: '{player} cooks {count} {resource} for {food} food',
      args: { player, count: option.count, resource: option.resource, food },
    })
    this.callPlayerCardHook(player, 'onCookAnimal', option.resource, option.count, food)
    this.callPlayerCardHook(player, 'onCook', option.resource, option.count, food)
    this.callPlayerCardHook(player, 'onConvertAnimalToFood', option.resource, option.count, food)
  }
  else if (option.type === 'cook-vegetable') {
    player._usedCookingThisTurn = true
    const food = player.cookVegetable(option.count)
    this.log.add({
      template: '{player} cooks {count} vegetable(s) for {food} food',
      args: { player, count: option.count, food },
    })
    this.callPlayerCardHook(player, 'onCook', 'vegetable', option.count, food)
  }
  else if (option.type === 'craft') {
    player.removeResource(option.resource, option.count)
    player.addResource('food', option.food)
    this.log.add({
      template: '{player} uses {improvement} to convert {resource} to {food} food',
      args: { player, improvement: option.improvement, resource: option.resource, food: option.food },
    })
    // Call onUseCraftConversion hooks (e.g., PlowBuilder offers plow when using Joinery)
    this.callPlayerCardHook(player, 'onUseCraftConversion', option.improvement, option.resource)
  }
  else if (option.type === 'card-cook') {
    player._usedCookingThisTurn = true
    player.removeAnimals(option.resource, option.count)
    player.addResource('food', option.food)
    this.log.add({
      template: '{player} uses {card} to cook {count} {resource} for {food} food',
      args: { player, card: option.cardName, count: option.count, resource: option.resource, food: option.food },
    })
    this.callPlayerCardHook(player, 'onCookAnimal', option.resource, option.count, option.food)
    this.callPlayerCardHook(player, 'onCook', option.resource, option.count, option.food)
    this.callPlayerCardHook(player, 'onConvertAnimalToFood', option.resource, option.count, option.food)
  }
  else if (option.type === 'card-convert') {
    player.removeResource(option.resource, option.count)
    player.addResource('food', option.food)
    this.log.add({
      template: '{player} uses {card} to convert {resource} to {food} food',
      args: { player, card: option.cardName, resource: option.resource, food: option.food },
    })
  }
}

Agricola.prototype.getAnytimeActions = function(player) {
  const options = []

  // Cooking conversions (requires Fireplace or Cooking Hearth)
  if (player.hasCookingAbility()) {
    const imp = player.getCookingImprovement()
    const rates = imp.abilities.cookingRates
    const animals = player.getAllAnimals()

    for (const [type, count] of Object.entries(animals)) {
      if (count > 0) {
        const food = rates[type]
        options.push({
          type: 'cook',
          resource: type,
          count: 1,
          food,
          description: `Cook 1 ${type} for ${food} food`,
        })
      }
    }

    // Cook vegetables at improvement rate (better than basic 1:1)
    if (player.vegetables > 0) {
      const food = rates.vegetables
      options.push({
        type: 'cook-vegetable',
        resource: 'vegetables',
        count: 1,
        food,
        description: `Cook 1 vegetable for ${food} food`,
      })
    }
  }

  // Card-based anytime conversions (e.g., Oriental Fireplace)
  for (const cardId of player.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (!card || !card.definition.anytimeConversions) {
      continue
    }
    for (const conv of card.definition.anytimeConversions) {
      if (['sheep', 'boar', 'cattle'].includes(conv.from)) {
        if (player.getTotalAnimals(conv.from) > 0) {
          options.push({
            type: 'card-cook',
            cardName: card.name,
            resource: conv.from,
            count: 1,
            food: conv.rate,
            description: `${card.name}: ${conv.from} → ${conv.rate} food`,
          })
        }
      }
      else {
        const resourceKey = conv.from
        if ((player[resourceKey] || 0) > 0) {
          options.push({
            type: 'card-convert',
            cardName: card.name,
            resource: resourceKey,
            count: 1,
            food: conv.rate,
            description: `${card.name}: ${resourceKey} → ${conv.rate} food`,
          })
        }
      }
    }
  }

  // Non-food anytime actions (e.g., Clearing Spade crop move)
  for (const cardId of player.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (!card || !card.definition.allowsAnytimeCropMove) {
      continue
    }
    const fieldSpaces = player.getFieldSpaces()
    const hasGridSource = fieldSpaces.some(f => f.crop && f.cropCount >= 2)
    const hasGridTarget = fieldSpaces.some(f => !f.crop || f.cropCount === 0)

    const sownVFs = player.getSownVirtualFields().filter(vf => vf.cropCount >= 2)
    const emptyVFs = player.getEmptyVirtualFields()

    const hasSource = hasGridSource || sownVFs.length > 0
    const hasTarget = hasGridTarget || emptyVFs.length > 0
    if (hasSource && hasTarget) {
      options.push({
        type: 'crop-move',
        cardName: card.name,
        description: `${card.name}: Move 1 crop to empty field`,
      })
    }
  }

  // Scan all cards for exchange, custom action, and purchase flags
  const allCardIds = [...player.playedMinorImprovements, ...player.playedOccupations]
  for (const cardId of allCardIds) {
    const card = this.cards.byId(cardId)
    if (!card) {
      continue
    }
    const def = card.definition

    // allowsAnytimeConversion (new structured format)
    if (def.allowsAnytimeConversion) {
      const conversions = Array.isArray(def.allowsAnytimeConversion)
        ? def.allowsAnytimeConversion
        : [def.allowsAnytimeConversion]
      for (const conv of conversions) {
        if (!canAffordCost(player, conv.from)) {
          continue
        }
        const foodOnly = Object.keys(conv.to).length === 1 && conv.to.food
        if (foodOnly) {
          // Food-only conversion — use card-convert type (matches feeding-phase pattern)
          const fromEntries = Object.entries(conv.from)
          const resource = fromEntries[0][0]
          const count = fromEntries[0][1]
          if (['sheep', 'boar', 'cattle'].includes(resource)) {
            options.push({
              type: 'card-cook',
              cardName: card.name,
              resource,
              count,
              food: conv.to.food,
              description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
            })
          }
          else {
            options.push({
              type: 'card-convert',
              cardName: card.name,
              resource,
              count,
              food: conv.to.food,
              description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
            })
          }
        }
        else {
          // Non-food exchange
          options.push({
            type: 'card-exchange',
            cardId: card.id,
            cardName: card.name,
            from: conv.from,
            to: conv.to,
            description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
          })
        }
      }
    }

    // allowsAnytimeExchange + exchangeOptions (array format)
    if (def.allowsAnytimeExchange && Array.isArray(def.exchangeOptions)) {
      for (const opt of def.exchangeOptions) {
        if (!canAffordCost(player, opt.from)) {
          continue
        }
        const action = {
          type: 'card-exchange',
          cardId: card.id,
          cardName: card.name,
          from: opt.from,
          to: opt.to,
          description: `${card.name}: ${formatExchange(opt.from, opt.to)}`,
        }
        if (opt.bonusPoints) {
          action.bonusPoints = opt.bonusPoints
        }
        options.push(action)
      }
    }

    // allowsAnytimeAction (custom card methods)
    if (def.allowsAnytimeAction && typeof def.getAnytimeActions === 'function') {
      const cardActions = def.getAnytimeActions.call(def, this, player)
      if (cardActions) {
        options.push(...cardActions)
      }
    }

    // allowsAnytimePurchase (custom purchase logic)
    if (def.allowsAnytimePurchase && typeof def.getAnytimeActions === 'function') {
      const cardActions = def.getAnytimeActions.call(def, this, player)
      if (cardActions) {
        options.push(...cardActions)
      }
    }
  }

  return options
}

Agricola.prototype.executeAnytimeAction = function(player, action) {
  if (action.type === 'crop-move') {
    this.executeAnytimeCropMove(player, action)
    return
  }
  if (action.type === 'card-exchange') {
    this.executeAnytimeCardExchange(player, action)
    return
  }
  if (action.type === 'card-custom') {
    this.executeAnytimeCardCustom(player, action)
    return
  }
  // Delegate to executeAnytimeFoodConversion for all food-related types
  this.executeAnytimeFoodConversion(player, action)
}

Agricola.prototype.executeAnytimeCardExchange = function(player, action) {
  // Pay from resources
  for (const [res, amt] of Object.entries(action.from)) {
    if (['sheep', 'boar', 'cattle'].includes(res)) {
      player.removeAnimals(res, amt)
    }
    else {
      player.removeResource(res, amt)
    }
  }
  // Gain to resources
  for (const [res, amt] of Object.entries(action.to)) {
    if (['sheep', 'boar', 'cattle'].includes(res)) {
      player.addAnimals(res, amt)
    }
    else {
      player.addResource(res, amt)
    }
  }
  // Handle bonus points (e.g., Kettle)
  if (action.bonusPoints) {
    player.bonusPoints = (player.bonusPoints || 0) + action.bonusPoints
  }
  this.log.add({
    template: '{player} uses {card}: {exchange}',
    args: { player, card: action.cardName, exchange: formatExchange(action.from, action.to) },
  })
}

Agricola.prototype.executeAnytimeCardCustom = function(player, action) {
  const card = this.cards.byId(action.cardId)
  if (!card) {
    return
  }
  const def = card.definition
  if (typeof def[action.actionKey] === 'function') {
    def[action.actionKey](this, player, action.actionArg)
  }
}

Agricola.prototype.getUnusedOncePerRoundActions = function(player) {
  return this.getAnytimeActions(player).filter(action => {
    if (!action.oncePerRound) {
      return false
    }
    if (!action.cardId) {
      return false
    }
    const state = this.cardState(action.cardId)
    return state.lastUsedRound !== this.state.round
  })
}

Agricola.prototype.executeAnytimeCropMove = function(player, action) {
  const fieldSpaces = player.getFieldSpaces()

  // Build source choices: grid fields + virtual fields with cropCount >= 2
  const sourceGridFields = fieldSpaces.filter(f => f.crop && f.cropCount >= 2)
  const sourceVFs = player.getSownVirtualFields().filter(vf => vf.cropCount >= 2)

  const sourceChoices = [
    ...sourceGridFields.map(f => `${f.row},${f.col} (${f.crop} x${f.cropCount})`),
    ...sourceVFs.map(vf => `[${vf.label}] (${vf.crop} x${vf.cropCount})`),
  ]

  const sourceSelection = this.actions.choose(player, sourceChoices, {
    title: `${action.cardName}: Pick source field`,
    min: 1, max: 1,
  })

  const sourceStr = Array.isArray(sourceSelection) ? sourceSelection[0] : sourceSelection

  // Determine source type and get crop info
  let cropType
  let sourceIsVirtual = false
  let sourceVF = null
  let sourceCell = null
  let sourceLabel

  if (sourceStr.startsWith('[')) {
    // Virtual field source
    sourceIsVirtual = true
    const labelMatch = sourceStr.match(/^\[(.+?)\]/)
    sourceLabel = labelMatch[1]
    sourceVF = [...sourceVFs].find(vf => vf.label === sourceLabel)
    cropType = sourceVF.crop
  }
  else {
    // Grid field source
    const [sourceRow, sourceCol] = sourceStr.split(' ')[0].split(',').map(Number)
    sourceCell = player.farmyard.grid[sourceRow][sourceCol]
    cropType = sourceCell.crop
    sourceLabel = `(${sourceRow},${sourceCol})`
  }

  // Build target choices: empty grid fields + empty virtual fields (respecting cropRestriction)
  const targetGridFields = fieldSpaces.filter(f => {
    if (f.crop && f.cropCount > 0) {
      return false
    }
    if (!sourceIsVirtual && f.row === Number(sourceStr.split(' ')[0].split(',')[0]) && f.col === Number(sourceStr.split(' ')[0].split(',')[1])) {
      return false
    }
    return true
  })
  const targetVFs = player.getEmptyVirtualFields().filter(vf => {
    if (sourceIsVirtual && vf.id === sourceVF.id) {
      return false
    }
    if (vf.cropRestriction && vf.cropRestriction !== cropType) {
      return false
    }
    return true
  })

  const targetChoices = [
    ...targetGridFields.map(f => `${f.row},${f.col}`),
    ...targetVFs.map(vf => `[${vf.label}]`),
  ]

  const targetSelection = this.actions.choose(player, targetChoices, {
    title: `${action.cardName}: Pick target field`,
    min: 1, max: 1,
  })

  const targetStr = Array.isArray(targetSelection) ? targetSelection[0] : targetSelection

  let targetLabel
  if (targetStr.startsWith('[')) {
    // Virtual field target
    const labelMatch = targetStr.match(/^\[(.+?)\]/)
    targetLabel = labelMatch[1]
    const targetVF = player.virtualFields.find(vf => vf.label === targetLabel)
    targetVF.crop = cropType
    targetVF.cropCount = 1
  }
  else {
    // Grid field target
    const [targetRow, targetCol] = targetStr.split(',').map(Number)
    const targetCell = player.farmyard.grid[targetRow][targetCol]
    targetCell.crop = cropType
    targetCell.cropCount = 1
    targetLabel = `(${targetRow},${targetCol})`
  }

  // Decrement source
  if (sourceIsVirtual) {
    sourceVF.cropCount -= 1
    if (sourceVF.cropCount === 0) {
      sourceVF.crop = null
    }
  }
  else {
    sourceCell.cropCount -= 1
    if (sourceCell.cropCount === 0) {
      sourceCell.crop = null
    }
  }

  this.log.add({
    template: '{player} uses {card} to move 1 {crop} from {source} to {target}',
    args: { player, card: action.cardName, crop: cropType, source: sourceLabel, target: targetLabel },
  })
}

Agricola.prototype.getAvailableMajorImprovements = function() {
  const majorZone = this.zones.byId('common.majorImprovements')
  return majorZone.cardlist().map(c => c.id)
}

/**
 * Check if a player can use the Adoptive Parents card ability.
 * Requirements:
 * - Player has no available workers
 * - Player has newborns from this round
 * - Player has at least 1 food
 * - Player has an occupation with allowImmediateOffspringAction flag
 */
Agricola.prototype.canUseAdoptiveParents = function(player) {
  // Must have no available workers
  if (player.getAvailableWorkers() > 0) {
    return false
  }

  // Must have newborns
  if (player.newborns.length === 0) {
    return false
  }

  // Must be able to adopt (has food)
  if (!player.canAdoptNewborn()) {
    return false
  }

  // Must have a card with allowImmediateOffspringAction
  const occupations = this.zones.byPlayer(player, 'occupations').cardlist()
  return occupations.some(card => card.definition.allowImmediateOffspringAction === true)
}

Agricola.prototype.canUseGuestRoom = function(player) {
  if (player.getAvailableWorkers() > 0) {
    return false
  }
  const card = this._getGuestRoomCard(player)
  if (!card) {
    return false
  }
  const state = this.cardState(card.id)
  if (!state.food || state.food <= 0) {
    return false
  }
  if (state.lastUsedRound === this.state.round) {
    return false
  }
  return true
}

Agricola.prototype._getGuestRoomCard = function(player) {
  const cards = this.getPlayerActiveCards(player)
  return cards.find(c => c.definition.enablesGuestWorker)
}

Agricola.prototype.canUseWorkPermit = function(player) {
  if (player.getAvailableWorkers() > 0) {
    return false
  }
  if (!this.state.workPermitWorkers || this.state.workPermitWorkers.length === 0) {
    return false
  }
  return this.state.workPermitWorkers.some(
    e => e.round === this.state.round && e.playerName === player.name
  )
}

Agricola.prototype.canUseBrotherlyLove = function(player) {
  if (player.getFamilySize() !== 4) {
    return false
  }
  if (player.getPersonPlacedThisRound() !== 2) {
    return false
  }
  if (player.getAvailableWorkers() < 2) {
    return false
  }
  const cards = this.getPlayerActiveCards(player)
  return cards.some(c => c.definition.modifiesWorkerPlacement === 'brotherlyLove')
}


////////////////////////////////////////////////////////////////////////////////
// End Game

Agricola.prototype.endGame = function() {
  this.log.add({ template: '=== Game Over ===' })
  this.log.add({ template: 'Calculating final scores' })
  this.log.indent()

  // First, spend resources for crafting bonuses (affects tie-breaker)
  // Revised Edition: Resources spent for Joinery/Pottery/Basketmaker bonus don't count for tie-breaker
  for (const player of this.players.all()) {
    player.spendResourcesForCraftingBonus()
  }

  // Process getEndGamePointsAllPlayers hooks (comparative scoring cards)
  for (const player of this.players.all()) {
    const cards = this.getPlayerActiveCards(player)
    for (const card of cards) {
      if (card.hasHook('getEndGamePointsAllPlayers')) {
        const bonuses = card.callHook('getEndGamePointsAllPlayers', this)
        if (bonuses) {
          for (const [playerName, points] of Object.entries(bonuses)) {
            const p = this.players.byName(playerName)
            if (p && points) {
              p.bonusPoints = (p.bonusPoints || 0) + points
            }
          }
        }
      }
    }
  }
  for (const player of this.players.all()) {
    player._endGameAllPlayersBonusApplied = true
  }

  // Collect scores and remaining resources for all players
  const playerResults = []

  for (const player of this.players.all()) {
    const breakdown = player.getScoreBreakdown()
    const buildingResources = player.getBuildingResourcesCount()

    this.log.add({
      template: '{player} score breakdown:',
      args: { player },
    })
    this.log.indent()

    this.log.add({ template: `Fields: ${breakdown.fields.count} = ${breakdown.fields.points} pts` })
    this.log.add({ template: `Pastures: ${breakdown.pastures.count} = ${breakdown.pastures.points} pts` })
    this.log.add({ template: `Grain: ${breakdown.grain.count} = ${breakdown.grain.points} pts` })
    this.log.add({ template: `Vegetables: ${breakdown.vegetables.count} = ${breakdown.vegetables.points} pts` })
    this.log.add({ template: `Sheep: ${breakdown.sheep.count} = ${breakdown.sheep.points} pts` })
    this.log.add({ template: `Wild Boar: ${breakdown.boar.count} = ${breakdown.boar.points} pts` })
    this.log.add({ template: `Cattle: ${breakdown.cattle.count} = ${breakdown.cattle.points} pts` })
    this.log.add({ template: `Rooms (${breakdown.rooms.type}): ${breakdown.rooms.count} = ${breakdown.rooms.points} pts` })
    this.log.add({ template: `Family: ${breakdown.familyMembers.count} = ${breakdown.familyMembers.points} pts` })
    this.log.add({ template: `Unused spaces: ${breakdown.unusedSpaces.count} = ${breakdown.unusedSpaces.points} pts` })
    this.log.add({ template: `Fenced stables: ${breakdown.fencedStables.count} = ${breakdown.fencedStables.points} pts` })
    this.log.add({ template: `Begging cards: ${breakdown.beggingCards.count} = ${breakdown.beggingCards.points} pts` })
    this.log.add({ template: `Card points: ${breakdown.cardPoints} pts` })
    this.log.add({ template: `Bonus points: ${breakdown.bonusPoints} pts` })
    this.log.add({ template: `TOTAL: ${breakdown.total} points` })
    this.log.add({ template: `Building resources remaining: ${buildingResources}` })

    this.log.outdent()

    playerResults.push({
      player,
      score: breakdown.total,
      buildingResources,
    })
  }

  this.log.outdent()

  // Determine winner with tie-breaker
  // Revised Edition: Tie-breaker is building resources (wood + clay + reed + stone) remaining in supply
  playerResults.sort((a, b) => {
    // First compare by score (higher is better)
    if (b.score !== a.score) {
      return b.score - a.score
    }
    // Tie-breaker: more building resources wins
    return b.buildingResources - a.buildingResources
  })

  const winner = playerResults[0]

  // Check for unbreakable tie
  const tiedPlayers = playerResults.filter(
    p => p.score === winner.score && p.buildingResources === winner.buildingResources
  )

  // Finalize stats before game ends
  this._finalizeStats(playerResults)

  if (tiedPlayers.length > 1) {
    // True tie - multiple winners
    const names = tiedPlayers.map(p => p.player.name).join(' and ')
    this.log.add({ template: `Tie between ${names}!` })
    this.youWin(winner.player, 'tied for highest score')
  }
  else if (playerResults[1] && playerResults[1].score === winner.score) {
    // Won by tie-breaker
    this.log.add({
      template: '{player} wins the tie-breaker with {resources} building resources',
      args: { player: winner.player, resources: winner.buildingResources },
    })
    this.youWin(winner.player, 'tie-breaker (more building resources)')
  }
  else {
    this.youWin(winner.player, 'highest score')
  }
}

Agricola.prototype._finalizeStats = function(playerResults) {
  for (const result of playerResults) {
    const playerStats = this.stats.players[result.player.name]
    if (playerStats) {
      playerStats.score = result.score

      // Calculate unplayed cards (drafted but not played)
      const draftedSet = new Set(playerStats.drafted)
      const playedSet = new Set(playerStats.played)
      playerStats.unplayed = [...draftedSet].filter(id => !playedSet.has(id))
    }
  }
}

Agricola.prototype.calculateScore = function(player) {
  return player.calculateScore()
}


////////////////////////////////////////////////////////////////////////////////
// Fence Utilities
// Pure functions for calculating fences, usable by both backend and frontend

/**
 * Check if a set of spaces are orthogonally connected.
 * @param {Array<{row: number, col: number}>} spaces - Array of space coordinates
 * @returns {boolean} True if all spaces are connected
 */
function areSpacesConnected(spaces) {
  if (!spaces || spaces.length <= 1) {
    return true
  }

  const spaceSet = new Set(spaces.map(s => `${s.row},${s.col}`))
  const visited = new Set()
  const queue = [spaces[0]]
  visited.add(`${spaces[0].row},${spaces[0].col}`)

  while (queue.length > 0) {
    const current = queue.shift()
    const { row, col } = current

    // Check all 4 orthogonal neighbors
    const neighbors = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ]

    for (const n of neighbors) {
      const key = `${n.row},${n.col}`
      if (spaceSet.has(key) && !visited.has(key)) {
        visited.add(key)
        queue.push(n)
      }
    }
  }

  return visited.size === spaces.length
}

/**
 * Calculate which edges of each selected space need fencing.
 * @param {Array<{row: number, col: number}>} spaces - Array of selected space coordinates
 * @param {Array} existingFences - Array of existing fence segments (optional)
 * @param {Object} options - Options: { rows: 3, cols: 5 } for board dimensions
 * @returns {Object} Map of "row,col" to { top, right, bottom, left } booleans
 */
function calculateFenceEdges(spaces, existingFences = [], options = {}) {
  const rows = options.rows || res.constants.farmyardRows || 3
  const cols = options.cols || res.constants.farmyardCols || 5

  const spaceSet = new Set(spaces.map(s => `${s.row},${s.col}`))
  const result = {}

  // Helper to check if a fence already exists between two cells
  const hasFenceBetween = (r1, c1, r2, c2) => {
    return existingFences.some(f =>
      (f.row1 === r1 && f.col1 === c1 && f.row2 === r2 && f.col2 === c2) ||
      (f.row1 === r2 && f.col1 === c2 && f.row2 === r1 && f.col2 === c1)
    )
  }

  // Helper to check if a board edge fence already exists
  const hasBoardEdgeFence = (row, col, edge) => {
    // Board edge fences are stored with row2/col2 as -1 to indicate edge
    return existingFences.some(f => {
      if (edge === 'top') {
        return f.row1 === row && f.col1 === col && f.row2 === -1 && f.edge === 'top'
      }
      if (edge === 'bottom') {
        return f.row1 === row && f.col1 === col && f.row2 === -1 && f.edge === 'bottom'
      }
      if (edge === 'left') {
        return f.row1 === row && f.col1 === col && f.col2 === -1 && f.edge === 'left'
      }
      if (edge === 'right') {
        return f.row1 === row && f.col1 === col && f.col2 === -1 && f.edge === 'right'
      }
      return false
    })
  }

  for (const coord of spaces) {
    const { row, col } = coord
    const key = `${row},${col}`
    const edges = { top: false, right: false, bottom: false, left: false }

    // Top edge
    if (row === 0) {
      // Board edge - needs fence unless already exists
      if (!hasBoardEdgeFence(row, col, 'top')) {
        edges.top = true
      }
    }
    else {
      const neighborKey = `${row - 1},${col}`
      if (!spaceSet.has(neighborKey) && !hasFenceBetween(row, col, row - 1, col)) {
        edges.top = true
      }
    }

    // Bottom edge
    if (row === rows - 1) {
      // Board edge - needs fence unless already exists
      if (!hasBoardEdgeFence(row, col, 'bottom')) {
        edges.bottom = true
      }
    }
    else {
      const neighborKey = `${row + 1},${col}`
      if (!spaceSet.has(neighborKey) && !hasFenceBetween(row, col, row + 1, col)) {
        edges.bottom = true
      }
    }

    // Left edge
    if (col === 0) {
      // Board edge - needs fence unless already exists
      if (!hasBoardEdgeFence(row, col, 'left')) {
        edges.left = true
      }
    }
    else {
      const neighborKey = `${row},${col - 1}`
      if (!spaceSet.has(neighborKey) && !hasFenceBetween(row, col, row, col - 1)) {
        edges.left = true
      }
    }

    // Right edge
    if (col === cols - 1) {
      // Board edge - needs fence unless already exists
      if (!hasBoardEdgeFence(row, col, 'right')) {
        edges.right = true
      }
    }
    else {
      const neighborKey = `${row},${col + 1}`
      if (!spaceSet.has(neighborKey) && !hasFenceBetween(row, col, row, col + 1)) {
        edges.right = true
      }
    }

    result[key] = edges
  }

  return result
}

/**
 * Count total number of new fences needed for a selection.
 * @param {Array<{row: number, col: number}>} spaces - Array of selected space coordinates
 * @param {Array} existingFences - Array of existing fence segments
 * @param {Object} options - Options: { rows: 3, cols: 5 } for board dimensions
 * @returns {number} Number of new fences needed
 */
function countFencesNeeded(spaces, existingFences = [], options = {}) {
  const edges = calculateFenceEdges(spaces, existingFences, options)
  let count = 0

  for (const key in edges) {
    const e = edges[key]
    if (e.top) {
      count++
    }
    if (e.right) {
      count++
    }
    if (e.bottom) {
      count++
    }
    if (e.left) {
      count++
    }
  }

  // Each internal fence is counted twice (once from each side), but since we're
  // only counting edges that need NEW fences (not in selection), this is correct.
  // However, we need to deduplicate fences that would be counted from both sides.
  // Actually, because we only count edges where neighbor is NOT in selection,
  // internal edges (between two selected spaces) are never counted at all.
  // So the count is already correct.

  return count
}

/**
 * Validate a pasture selection.
 * @param {Array<{row: number, col: number}>} spaces - Array of selected space coordinates
 * @param {Object} params - Validation parameters
 * @param {number} params.wood - Available wood
 * @param {number} params.currentFenceCount - Current number of fences placed
 * @param {number} params.maxFences - Maximum fences allowed (default 15)
 * @param {Array} params.existingFences - Array of existing fence segments
 * @param {Function} params.isSpaceValid - Function(row, col) to check if space can be fenced
 * @returns {Object} { valid, error, fencesNeeded, fenceEdges }
 */
function validatePastureSelection(spaces, params = {}) {
  const {
    wood = Infinity,
    currentFenceCount = 0,
    maxFences = res.constants.maxFences || 15,
    existingFences = [],
    isSpaceValid = () => true,
  } = params

  if (!spaces || spaces.length === 0) {
    return { valid: false, error: 'No spaces selected', fencesNeeded: 0 }
  }

  // Check all spaces are valid
  for (const coord of spaces) {
    if (!isSpaceValid(coord.row, coord.col)) {
      return { valid: false, error: 'Invalid space selected', fencesNeeded: 0 }
    }
  }

  // Check connectivity
  if (!areSpacesConnected(spaces)) {
    return { valid: false, error: 'Spaces must be connected', fencesNeeded: 0 }
  }

  // Calculate fences needed
  const fenceEdges = calculateFenceEdges(spaces, existingFences)
  const fencesNeeded = countFencesNeeded(spaces, existingFences)

  // Check wood
  if (fencesNeeded > wood) {
    return {
      valid: false,
      error: `Need ${fencesNeeded} wood (have ${wood})`,
      fencesNeeded,
      fenceEdges,
    }
  }

  // Check fence limit
  const remainingFences = maxFences - currentFenceCount
  if (fencesNeeded > remainingFences) {
    return {
      valid: false,
      error: `Need ${fencesNeeded} fences (${remainingFences} remaining)`,
      fencesNeeded,
      fenceEdges,
    }
  }

  return {
    valid: true,
    fencesNeeded,
    fenceEdges,
  }
}
