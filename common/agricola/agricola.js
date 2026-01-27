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
  })
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
}

Agricola.prototype.initializeZones = function() {
  // Create common zones
  this.zones.register(new AgricolaZone(this, 'common.actionSpaces', 'Action Spaces', 'public'))
  this.zones.register(new AgricolaZone(this, 'common.futureActions', 'Future Actions', 'public'))
  this.zones.register(new AgricolaZone(this, 'common.majorImprovements', 'Major Improvements', 'public'))

  // Create player zones
  for (const player of this.players.all()) {
    this.zones.register(new AgricolaZone(this, `players.${player.name}.hand`, 'Hand', 'private', player))
    this.zones.register(new AgricolaZone(this, `players.${player.name}.played`, 'Played', 'public', player))
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
  // All 10 major improvements are available at game start
  this.state.availableMajorImprovements = res.getAllMajorImprovements().map(imp => imp.id)
}

Agricola.prototype.initializePlayerCards = function() {
  const playerCount = this.players.all().length
  const cardsPerPlayer = 7

  // Get cards appropriate for this player count
  const allCards = res.getCardsByPlayerCount(playerCount)
  const occupations = allCards.filter(c => c.type === 'occupation')
  const minorImprovements = allCards.filter(c => c.type === 'minor')

  // Shuffle both decks
  const shuffledOccupations = this.shuffleArray([...occupations])
  const shuffledMinors = this.shuffleArray([...minorImprovements])

  if (this.settings.useDrafting) {
    // Set up draft pools - each player gets a starting hand to draft from
    this.state.draftPools = {
      occupations: [],
      minors: [],
    }

    for (let i = 0; i < playerCount; i++) {
      // Create pools of cards that will be passed around
      const occPool = shuffledOccupations
        .splice(0, cardsPerPlayer)
        .map(c => c.id)
      const minorPool = shuffledMinors
        .splice(0, cardsPerPlayer)
        .map(c => c.id)

      this.state.draftPools.occupations.push(occPool)
      this.state.draftPools.minors.push(minorPool)
    }

    // Initialize empty hands
    for (const player of this.players.all()) {
      player.hand = []
    }

    this.log.add({
      template: 'Card drafting will begin',
    })
  }
  else {
    // Deal cards directly to each player (no drafting)
    for (let i = 0; i < playerCount; i++) {
      const player = this.players.all()[i]

      // Deal 7 occupations
      const playerOccupations = shuffledOccupations
        .splice(0, cardsPerPlayer)
        .map(c => c.id)

      // Deal 7 minor improvements
      const playerMinors = shuffledMinors
        .splice(0, cardsPerPlayer)
        .map(c => c.id)

      // Add to player's hand
      player.hand = [...playerOccupations, ...playerMinors]

      this.log.add({
        template: '{player} receives {occ} occupations and {minor} minor improvements',
        args: { player, occ: playerOccupations.length, minor: playerMinors.length },
      })
    }
  }
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
      const card = res.getCardById(id)
      return card && card.type === 'occupation'
    })
    const minors = player.hand.filter(id => {
      const card = res.getCardById(id)
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
  const cardsPerPlayer = pools[0].length
  const cardTypeName = cardType === 'occupations' ? 'Occupation' : 'Minor Improvement'

  // Track which pool each player is currently looking at
  // Player i starts with pool i
  const poolAssignments = players.map((_, i) => i)

  // Track how many cards each player has picked in this draft
  const pickCounts = players.map(() => 0)

  for (let round = 0; round < cardsPerPlayer; round++) {
    this.log.add({
      template: 'Draft round {round}',
      args: { round: round + 1 },
    })
    this.log.indent()

    // Reset pick counts for this round
    for (let i = 0; i < playerCount; i++) {
      pickCounts[i] = 0
    }

    // All players draft in parallel until everyone has picked once this round
    while (pickCounts.some((count, i) => count === 0 && pools[poolAssignments[i]].length > 0)) {
      // Build options for all players who haven't picked yet this round
      const playerOptions = []

      for (let i = 0; i < playerCount; i++) {
        if (pickCounts[i] > 0) {
          continue // Already picked this round
        }

        const player = players[i]
        const poolIndex = poolAssignments[i]
        const pool = pools[poolIndex]

        if (pool.length === 0) {
          continue
        }

        // Build choice list with card names
        const choices = pool.map(cardId => {
          const card = res.getCardById(cardId)
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

      // Allow any player to draft
      const response = this.requestInputAny(playerOptions)
      const player = this.players.byName(response.actor)
      const playerIndex = players.indexOf(player)
      const poolIndex = poolAssignments[playerIndex]
      const pool = pools[poolIndex]
      const selectedName = response.selection[0]

      // Find the card id by name
      const cardId = pool.find(id => {
        const card = res.getCardById(id)
        return card && card.name === selectedName
      })

      if (cardId) {
        // Remove from pool and add to hand
        const cardIndex = pool.indexOf(cardId)
        pool.splice(cardIndex, 1)
        player.hand.push(cardId)
        pickCounts[playerIndex]++

        this.log.add({
          template: '{player} drafts {draftedCard}',
          args: { player, draftedCard: selectedName },
        })
      }
    }

    this.log.outdent()

    // Pass pools to neighbor (if not last round)
    if (round < cardsPerPlayer - 1) {
      for (let i = 0; i < playerCount; i++) {
        // Move pool assignment in the pass direction
        poolAssignments[i] = (poolAssignments[i] + passDirection + playerCount) % playerCount
      }
    }
  }
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
    this.collectWellFood()
    this.workPhase()
    this.returnHomePhase()

    // Check for harvest
    if (res.constants.harvestRounds.includes(this.state.round)) {
      this.harvestPhase()
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
  }
}

Agricola.prototype.replenishPhase = function() {
  this.log.add({ template: 'Replenishing action spaces' })
  this.log.indent()

  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates) {
      const state = this.state.actionSpaces[actionId]

      for (const [, amount] of Object.entries(action.accumulates)) {
        state.accumulated += amount
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

Agricola.prototype.collectWellFood = function() {
  // Players with wells receive food at the start of each round
  if (!this.state.wellFood) {
    return
  }

  for (const player of this.players.all()) {
    const wellFood = this.state.wellFood[player.name]
    if (wellFood && wellFood[this.state.round]) {
      const food = wellFood[this.state.round]
      player.food += food
      delete wellFood[this.state.round]

      this.log.add({
        template: '{player} receives {food} food from the Well',
        args: { player, food },
      })
    }
  }
}

Agricola.prototype.workPhase = function() {
  this.log.add({ template: 'Work phase begins' })
  this.log.indent()

  // Reset all action space occupation
  for (const actionId of this.state.activeActions) {
    this.state.actionSpaces[actionId].occupiedBy = null
  }

  // Calculate total workers available
  let totalWorkers = 0
  for (const player of this.players.all()) {
    totalWorkers += player.getAvailableWorkers()
  }

  // Work phase continues until all workers are placed
  let workersPlaced = 0
  let currentPlayerIndex = this.players.all().findIndex(p => p.name === this.state.startingPlayer)

  while (workersPlaced < totalWorkers) {
    // Find next player with available workers
    const playerList = this.players.all()
    let attempts = 0

    while (attempts < playerList.length) {
      const player = playerList[currentPlayerIndex]

      if (player.getAvailableWorkers() > 0) {
        const workersUsed = player.getFamilySize() - player.getAvailableWorkers() + 1
        const totalWorkerCount = player.getFamilySize()
        this.log.add({
          template: "{player}'s turn ({workersUsed}/{totalWorkers})",
          args: { player, workersUsed, totalWorkers: totalWorkerCount },
        })
        this.log.indent()
        this.playerTurn(player)
        this.log.outdent()
        workersPlaced++
        break
      }

      currentPlayerIndex = (currentPlayerIndex + 1) % playerList.length
      attempts++
    }

    if (attempts >= playerList.length) {
      // No players have workers left
      break
    }

    // Move to next player
    currentPlayerIndex = (currentPlayerIndex + 1) % playerList.length
  }

  this.log.outdent()
}

Agricola.prototype.playerTurn = function(player) {
  const availableActions = this.getAvailableActions(player)

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

    let label = action.name
    if (action.type === 'accumulating' && state.accumulated > 0) {
      label += ` (${state.accumulated})`
    }
    return { id: actionId, label }
  })

  const selection = this.actions.choose(
    player,
    choices.map(c => c.label),
    { title: 'Choose an action', min: 1, max: 1 }
  )

  // Find the selected action
  const selectedLabel = selection[0]
  const selectedChoice = choices.find(c => c.label === selectedLabel)

  if (selectedChoice) {
    const actionId = selectedChoice.id

    // Mark action as occupied
    this.state.actionSpaces[actionId].occupiedBy = player.name

    // Use a worker
    player.useWorker()

    // Execute the action
    this.actions.executeAction(player, actionId)
  }
}

Agricola.prototype.getAvailableActions = function(player) {
  const available = []

  for (const actionId of this.state.activeActions) {
    const state = this.state.actionSpaces[actionId]

    // Action must not be occupied
    if (state.occupiedBy) {
      continue
    }

    // Check if player can meaningfully take this action
    // (some actions might have prerequisites)
    if (this.canTakeAction(player, actionId)) {
      available.push(actionId)
    }
  }

  return available
}

Agricola.prototype.canTakeAction = function(player, actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }

  // Family growth actions have prerequisites
  if (action.allowsFamilyGrowth) {
    if (action.requiresRoom !== false) {
      // Standard family growth - needs room
      if (!player.canGrowFamily(true)) {
        return false
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

Agricola.prototype.returnHomePhase = function() {
  this.log.add({ template: 'Workers return home' })

  for (const player of this.players.all()) {
    player.resetWorkers()
  }
}


////////////////////////////////////////////////////////////////////////////////
// Harvest Phase

Agricola.prototype.harvestPhase = function() {
  this.log.add({ template: '=== Harvest ===' })
  this.log.indent()

  this.fieldPhase()
  this.feedingPhase()
  this.breedingPhase()

  this.log.outdent()
}

Agricola.prototype.fieldPhase = function() {
  this.log.add({ template: 'Field Phase: Harvesting crops' })

  for (const player of this.players.all()) {
    const harvested = player.harvestFields()

    if (harvested.grain > 0 || harvested.vegetables > 0) {
      this.log.add({
        template: '{player} harvests {grain} grain and {veg} vegetables',
        args: { player, grain: harvested.grain, veg: harvested.vegetables },
      })
    }
  }
}

Agricola.prototype.feedingPhase = function() {
  this.log.add({ template: 'Feeding Phase' })

  for (const player of this.players.all()) {
    const required = player.getFoodRequired()

    this.log.add({
      template: '{player} needs {food} food',
      args: { player, food: required },
    })

    // Allow player to convert resources to food
    this.allowFoodConversion(player, required)

    // Feed the family
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
  }
}

Agricola.prototype.allowFoodConversion = function(player, required) {
  while (player.food < required) {
    const options = []

    // Basic conversions (always available)
    if (player.grain > 0) {
      options.push('Convert 1 grain to 1 food')
    }
    if (player.vegetables > 0) {
      options.push('Convert 1 vegetable to 1 food')
    }

    // Cooking (requires improvement)
    if (player.hasCookingAbility()) {
      const animals = player.getAllAnimals()
      if (animals.sheep > 0) {
        options.push('Cook 1 sheep')
      }
      if (animals.boar > 0) {
        options.push('Cook 1 boar')
      }
      if (animals.cattle > 0) {
        options.push('Cook 1 cattle')
      }
      if (player.vegetables > 0) {
        options.push('Cook 1 vegetable')
      }
    }

    // Crafting improvements (harvest conversion)
    for (const impId of player.majorImprovements) {
      const imp = res.getMajorImprovementById(impId)
      if (imp && imp.abilities && imp.abilities.harvestConversion) {
        const resource = imp.abilities.harvestConversion.resource
        if (player[resource] > 0) {
          options.push(`Use ${imp.name}`)
        }
      }
    }

    if (options.length === 0) {
      break // No more conversion options
    }

    options.push('Done converting')

    const selection = this.actions.choose(player, options, {
      title: `Need ${required - player.food} more food`,
      min: 1,
      max: 1,
    })

    const choice = selection[0]

    if (choice === 'Done converting') {
      break
    }

    if (choice === 'Convert 1 grain to 1 food') {
      player.convertToFood('grain', 1)
    }
    else if (choice === 'Convert 1 vegetable to 1 food') {
      player.convertToFood('vegetables', 1)
    }
    else if (choice === 'Cook 1 sheep') {
      player.cookAnimal('sheep', 1)
    }
    else if (choice === 'Cook 1 boar') {
      player.cookAnimal('boar', 1)
    }
    else if (choice === 'Cook 1 cattle') {
      player.cookAnimal('cattle', 1)
    }
    else if (choice === 'Cook 1 vegetable') {
      player.cookVegetable(1)
    }
    else if (choice.startsWith('Use ')) {
      // Crafting improvement
      for (const impId of player.majorImprovements) {
        const imp = res.getMajorImprovementById(impId)
        if (imp && choice === `Use ${imp.name}`) {
          const conv = imp.abilities.harvestConversion
          if (player[conv.resource] > 0) {
            player[conv.resource] -= 1
            player.food += conv.food

            this.log.add({
              template: '{player} uses {imp} to convert {resource} to {food} food',
              args: { player, imp: imp.name, resource: conv.resource, food: conv.food },
            })
          }
          break
        }
      }
    }
  }
}

Agricola.prototype.breedingPhase = function() {
  this.log.add({ template: 'Breeding Phase' })

  for (const player of this.players.all()) {
    const bred = player.breedAnimals()

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
}


////////////////////////////////////////////////////////////////////////////////
// Helper Methods

Agricola.prototype.getAvailableMajorImprovements = function() {
  return this.state.availableMajorImprovements.filter(id => {
    // Check that no player owns this improvement
    for (const player of this.players.all()) {
      if (player.majorImprovements.includes(id)) {
        return false
      }
    }
    return true
  })
}


////////////////////////////////////////////////////////////////////////////////
// End Game

Agricola.prototype.endGame = function() {
  this.log.add({ template: '=== Game Over ===' })
  this.log.add({ template: 'Calculating final scores' })
  this.log.indent()

  let highestScore = -Infinity
  let winner = null

  for (const player of this.players.all()) {
    const breakdown = player.getScoreBreakdown()

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

    this.log.outdent()

    if (breakdown.total > highestScore) {
      highestScore = breakdown.total
      winner = player
    }
  }

  this.log.outdent()

  if (winner) {
    this.youWin(winner, 'highest score')
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
