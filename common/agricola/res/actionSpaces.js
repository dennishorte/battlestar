// Agricola Action Spaces Definitions

// Base actions available from the start of the game
const baseActions = [
  {
    id: 'build-room-stable',
    name: 'Build Room and/or Stable',
    description: 'Build 1 room (5 building material + 2 reed) and/or 1 stable (2 wood)',
    type: 'instant',
    allowsRoomBuilding: true,
    allowsStableBuilding: true,
  },
  {
    id: 'starting-player',
    name: 'Starting Player',
    description: 'Become starting player and take 1 food',
    type: 'instant',
    gives: { food: 1 },
    startsPlayer: true,
  },
  {
    id: 'take-grain',
    name: 'Take 1 Grain',
    description: 'Take 1 grain',
    type: 'instant',
    gives: { grain: 1 },
  },
  {
    id: 'plow-field',
    name: 'Plow 1 Field',
    description: 'Plow 1 field on an empty farmyard space',
    type: 'instant',
    allowsPlowing: 1,
  },
  {
    id: 'occupation',
    name: '1 Occupation',
    description: 'Play 1 occupation card (first is free, then 1 food each)',
    type: 'instant',
    allowsOccupation: true,
  },
  {
    id: 'day-laborer',
    name: 'Day Laborer',
    description: 'Take 2 food',
    type: 'instant',
    gives: { food: 2 },
  },
  {
    id: 'take-wood',
    name: 'Take Wood',
    description: 'Take accumulated wood (3 per round)',
    type: 'accumulating',
    accumulates: { wood: 3 },
  },
  {
    id: 'take-clay',
    name: 'Take Clay',
    description: 'Take accumulated clay (1 per round)',
    type: 'accumulating',
    accumulates: { clay: 1 },
  },
  {
    id: 'take-reed',
    name: 'Take Reed',
    description: 'Take accumulated reed (1 per round)',
    type: 'accumulating',
    accumulates: { reed: 1 },
  },
  {
    id: 'fishing',
    name: 'Fishing',
    description: 'Take accumulated food (1 per round)',
    type: 'accumulating',
    accumulates: { food: 1 },
  },
]

// Round cards revealed progressively throughout the game
// Each stage has cards shuffled, then revealed one per round
const roundCards = [
  // Stage 1: Rounds 1-4
  {
    id: 'sow-bake',
    name: 'Sow and/or Bake Bread',
    description: 'Sow seeds on fields and/or bake bread with an oven',
    stage: 1,
    type: 'instant',
    allowsSowing: true,
    allowsBaking: true,
  },
  {
    id: 'take-sheep',
    name: 'Take Sheep',
    description: 'Take accumulated sheep (1 per round)',
    stage: 1,
    type: 'accumulating',
    accumulates: { sheep: 1 },
  },
  {
    id: 'fencing',
    name: 'Fencing',
    description: 'Build fences to create pastures (1 wood per fence)',
    stage: 1,
    type: 'instant',
    allowsFencing: true,
  },
  {
    id: 'major-minor-improvement',
    name: 'Major or Minor Improvement',
    description: 'Build 1 major or minor improvement',
    stage: 1,
    type: 'instant',
    allowsMajorImprovement: true,
    allowsMinorImprovement: true,
  },

  // Stage 2: Rounds 5-7
  {
    id: 'family-growth-minor',
    name: 'Family Growth + Minor Improvement',
    description: 'Grow your family (need room) and optionally play a minor improvement',
    stage: 2,
    type: 'instant',
    allowsFamilyGrowth: true,
    requiresRoom: true,
    allowsMinorImprovement: true,
  },
  {
    id: 'take-stone-1',
    name: 'Take Stone',
    description: 'Take accumulated stone (1 per round)',
    stage: 2,
    type: 'accumulating',
    accumulates: { stone: 1 },
  },
  {
    id: 'renovation-improvement',
    name: 'Renovation + Improvement',
    description: 'Renovate your house and optionally build a major or minor improvement',
    stage: 2,
    type: 'instant',
    allowsRenovation: true,
    allowsMajorImprovement: true,
    allowsMinorImprovement: true,
  },

  // Stage 3: Rounds 8-9
  {
    id: 'take-vegetable',
    name: 'Take 1 Vegetable',
    description: 'Take 1 vegetable',
    stage: 3,
    type: 'instant',
    gives: { vegetables: 1 },
  },
  {
    id: 'take-boar',
    name: 'Take Wild Boar',
    description: 'Take accumulated wild boar (1 per round)',
    stage: 3,
    type: 'accumulating',
    accumulates: { boar: 1 },
  },

  // Stage 4: Rounds 10-11
  {
    id: 'take-cattle',
    name: 'Take Cattle',
    description: 'Take accumulated cattle (1 per round)',
    stage: 4,
    type: 'accumulating',
    accumulates: { cattle: 1 },
  },
  {
    id: 'take-stone-2',
    name: 'Take Stone',
    description: 'Take accumulated stone (1 per round)',
    stage: 4,
    type: 'accumulating',
    accumulates: { stone: 1 },
  },

  // Stage 5: Rounds 12-13
  {
    id: 'family-growth-urgent',
    name: 'Family Growth (No Room)',
    description: 'Grow your family even without an empty room',
    stage: 5,
    type: 'instant',
    allowsFamilyGrowth: true,
    requiresRoom: false,
  },
  {
    id: 'plow-sow',
    name: 'Plow and/or Sow',
    description: 'Plow 1 field and/or sow seeds',
    stage: 5,
    type: 'instant',
    allowsPlowing: 1,
    allowsSowing: true,
  },

  // Stage 6: Round 14
  {
    id: 'renovation-fencing',
    name: 'Renovation and/or Fencing',
    description: 'Renovate your house and/or build fences',
    stage: 6,
    type: 'instant',
    allowsRenovation: true,
    allowsFencing: true,
  },
]

// Get round cards by stage
function getRoundCardsByStage(stage) {
  return roundCards.filter(card => card.stage === stage)
}

// Get all action space definitions
function getAllActionSpaces() {
  return [...baseActions, ...roundCards]
}

// Get base actions only
function getBaseActions() {
  return baseActions
}

// Get round cards only
function getRoundCards() {
  return roundCards
}

// Get action by ID (includes player-count specific actions)
function getActionById(id) {
  // Search base and round actions first
  const baseOrRound = getAllActionSpaces().find(action => action.id === id)
  if (baseOrRound) {
    return baseOrRound
  }
  // Search player-count specific actions
  const playerCountAction = [...threePlayerActions, ...fourPlusPlayerActions].find(action => action.id === id)
  return playerCountAction
}

// Create initial action space state for the game
function createActionSpaceState(actionIds) {
  const state = {}
  for (const id of actionIds) {
    const action = getActionById(id)
    if (action && action.type === 'accumulating') {
      state[id] = {
        accumulated: 0,
        occupiedBy: null,
      }
    }
    else {
      state[id] = {
        occupiedBy: null,
      }
    }
  }
  return state
}

// Additional action spaces for 3+ player games
// These are placed on the board in addition to the base actions
const threePlayerActions = [
  {
    id: 'take-1-building-resource',
    name: 'Take 1 Building Resource',
    description: 'Take 1 wood, clay, reed, or stone',
    type: 'instant',
    allowsResourceChoice: ['wood', 'clay', 'reed', 'stone'],
    choiceCount: 1,
  },
  {
    id: 'clay-pit',
    name: 'Clay Pit',
    description: 'Take accumulated clay (2 per round)',
    type: 'accumulating',
    accumulates: { clay: 2 },
  },
  {
    id: 'take-3-wood',
    name: 'Take 3 Wood',
    description: 'Take 3 wood',
    type: 'instant',
    gives: { wood: 3 },
  },
  {
    id: 'resource-market',
    name: 'Resource Market',
    description: 'Take 1 each of 2 different building resources',
    type: 'instant',
    allowsResourceChoice: ['wood', 'clay', 'reed', 'stone'],
    choiceCount: 2,
    choiceMustBeDifferent: true,
  },
]

// Additional action spaces for 4-5 player games (in addition to 3-player actions)
const fourPlusPlayerActions = [
  {
    id: 'copse',
    name: 'Copse',
    description: 'Take accumulated wood (1 per round)',
    type: 'accumulating',
    accumulates: { wood: 1 },
  },
  {
    id: 'take-2-wood',
    name: 'Take 2 Wood',
    description: 'Take 2 wood',
    type: 'instant',
    gives: { wood: 2 },
  },
]

// Get additional actions for a specific player count
function getAdditionalActionsForPlayerCount(playerCount) {
  if (playerCount <= 2) {
    return []
  }
  if (playerCount === 3) {
    return threePlayerActions
  }
  // 4 or 5 players
  return [...threePlayerActions, ...fourPlusPlayerActions]
}

// Get accumulation rates for all accumulating actions
function getAccumulationRates() {
  const rates = {}
  for (const action of getAllActionSpaces()) {
    if (action.type === 'accumulating' && action.accumulates) {
      rates[action.id] = action.accumulates
    }
  }
  // Also include player-count specific actions
  for (const action of [...threePlayerActions, ...fourPlusPlayerActions]) {
    if (action.type === 'accumulating' && action.accumulates) {
      rates[action.id] = action.accumulates
    }
  }
  return rates
}

module.exports = {
  baseActions,
  roundCards,
  threePlayerActions,
  fourPlusPlayerActions,
  getRoundCardsByStage,
  getAllActionSpaces,
  getBaseActions,
  getRoundCards,
  getActionById,
  createActionSpaceState,
  getAccumulationRates,
  getAdditionalActionsForPlayerCount,
}
