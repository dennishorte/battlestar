// Agricola Action Spaces Definitions (Revised Edition)

// Base actions available from the start of the game
const baseActions = [
  {
    id: 'build-room-stable',
    name: 'Farm Expansion',
    description: 'Build Rooms and/or Build Stables',
    type: 'instant',
    allowsRoomBuilding: true,
    allowsStableBuilding: true,
  },
  {
    id: 'starting-player',
    name: 'Meeting Place',
    description: 'Become the Starting Player and afterward Minor Improvement',
    type: 'instant',
    gives: { food: 1 },
    startsPlayer: true,
    allowsMinorImprovement: true, // Revised Edition: allows minor improvement after becoming SP
  },
  {
    id: 'take-grain',
    name: 'Grain Seeds',
    description: 'Receive 1 Grain',
    type: 'instant',
    gives: { grain: 1 },
  },
  {
    id: 'plow-field',
    name: 'Farmland',
    description: 'Plow 1 Field',
    type: 'instant',
    allowsPlowing: 1,
  },
  {
    id: 'occupation',
    name: 'Lessons',
    description: 'Play 1 Occupation (first is free, then 1 food each)',
    type: 'instant',
    allowsOccupation: true,
  },
  {
    id: 'day-laborer',
    name: 'Day Laborer',
    description: 'Receive 2 Food',
    type: 'instant',
    gives: { food: 2 },
  },
  {
    id: 'take-wood',
    name: 'Forest',
    description: 'Accumulation Space: +3 Wood',
    type: 'accumulating',
    accumulates: { wood: 3 },
  },
  {
    id: 'take-clay',
    name: 'Clay Pit',
    description: 'Accumulation Space: +1 Clay',
    type: 'accumulating',
    accumulates: { clay: 1 },
  },
  {
    id: 'take-reed',
    name: 'Reed Bank',
    description: 'Accumulation Space: +1 Reed',
    type: 'accumulating',
    accumulates: { reed: 1 },
  },
  {
    id: 'fishing',
    name: 'Fishing',
    description: 'Accumulation Space: +1 Food',
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
    name: 'Grain Utilization',
    description: 'Sow and/or Bake Bread',
    stage: 1,
    type: 'instant',
    allowsSowing: true,
    allowsBaking: true,
  },
  {
    id: 'take-sheep',
    name: 'Sheep Market',
    description: 'Accumulation Space: +1 Sheep',
    stage: 1,
    type: 'accumulating',
    accumulates: { sheep: 1 },
  },
  {
    id: 'fencing',
    name: 'Fencing',
    description: 'Build Fences',
    stage: 1,
    type: 'instant',
    allowsFencing: true,
  },
  {
    id: 'major-minor-improvement',
    name: 'Major Improvement',
    description: 'Major or Minor Improvement',
    stage: 1,
    type: 'instant',
    allowsMajorImprovement: true,
    allowsMinorImprovement: true,
  },

  // Stage 2: Rounds 5-7
  {
    id: 'family-growth-minor',
    name: 'Basic Wish for Children',
    description: 'Family Growth with Room Only and afterward Minor Improvement',
    stage: 2,
    type: 'instant',
    allowsFamilyGrowth: true,
    requiresRoom: true,
    allowsMinorImprovement: true,
  },
  {
    id: 'take-stone-1',
    name: 'Western Quarry',
    description: 'Accumulation Space: +1 Stone',
    stage: 2,
    type: 'accumulating',
    accumulates: { stone: 1 },
  },
  {
    id: 'renovation-improvement',
    name: 'House Redevelopment',
    description: '1 Renovation and afterward Major or Minor Improvement',
    stage: 2,
    type: 'instant',
    allowsRenovation: true,
    allowsMajorImprovement: true,
    allowsMinorImprovement: true,
  },

  // Stage 3: Rounds 8-9
  {
    id: 'take-vegetable',
    name: 'Vegetable Seeds',
    description: 'Receive 1 Vegetable',
    stage: 3,
    type: 'instant',
    gives: { vegetables: 1 },
  },
  {
    id: 'take-boar',
    name: 'Pig Market',
    description: 'Accumulation Space: +1 Wild Boar',
    stage: 3,
    type: 'accumulating',
    accumulates: { boar: 1 },
  },

  // Stage 4: Rounds 10-11
  {
    id: 'take-cattle',
    name: 'Cattle Market',
    description: 'Accumulation Space: +1 Cattle',
    stage: 4,
    type: 'accumulating',
    accumulates: { cattle: 1 },
  },
  {
    id: 'take-stone-2',
    name: 'Eastern Quarry',
    description: 'Accumulation Space: +1 Stone',
    stage: 4,
    type: 'accumulating',
    accumulates: { stone: 1 },
  },

  // Stage 5: Rounds 12-13
  {
    id: 'family-growth-urgent',
    name: 'Urgent Wish for Children',
    description: 'Family Growth Even without Room',
    stage: 5,
    type: 'instant',
    allowsFamilyGrowth: true,
    requiresRoom: false,
  },
  {
    id: 'plow-sow',
    name: 'Cultivation',
    description: 'Plow 1 Field and/or Sow',
    stage: 5,
    type: 'instant',
    allowsPlowing: 1,
    allowsSowing: true,
  },

  // Stage 6: Round 14
  {
    id: 'renovation-fencing',
    name: 'Farm Redevelopment',
    description: '1 Renovation and/or Build Fences',
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
  const playerCountAction = [
    ...threePlayerActions,
    ...fourPlayerActions,
    ...fiveSixPlayerActions,
    ...sixPlayerOnlyActions,
  ].find(action => action.id === id)
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

// Additional action spaces for 3-player games
// Revised Edition names and accumulation rates
const threePlayerActions = [
  {
    id: 'grove',
    name: 'Grove',
    description: 'Accumulation Space: +2 Wood',
    type: 'accumulating',
    accumulates: { wood: 2 },
  },
  {
    id: 'hollow',
    name: 'Hollow',
    description: 'Accumulation Space: +1 Clay',
    type: 'accumulating',
    accumulates: { clay: 1 },
  },
  {
    id: 'resource-market',
    name: 'Resource Market',
    description: '1 Food, and 1 Reed or 1 Stone',
    type: 'instant',
    gives: { food: 1 },
    allowsResourceChoice: ['reed', 'stone'],
    choiceCount: 1,
  },
  {
    id: 'lessons-3',
    name: 'Lessons',
    description: 'Play 1 Occupation (occupation cost: 2 food)',
    type: 'instant',
    allowsOccupation: true,
    occupationCost: 2, // Always 2 food in 3-player
  },
]

// Additional action spaces for 4-player games only
const fourPlayerActions = [
  {
    id: 'copse',
    name: 'Copse',
    description: 'Accumulation Space: +1 Wood',
    type: 'accumulating',
    accumulates: { wood: 1 },
  },
  {
    id: 'grove',
    name: 'Grove',
    description: 'Accumulation Space: +2 Wood',
    type: 'accumulating',
    accumulates: { wood: 2 },
  },
  {
    id: 'hollow',
    name: 'Hollow',
    description: 'Accumulation Space: +2 Clay',
    type: 'accumulating',
    accumulates: { clay: 2 },
  },
  {
    id: 'resource-market',
    name: 'Resource Market',
    description: '1 Reed, 1 Stone, 1 Food',
    type: 'instant',
    gives: { food: 1, reed: 1, stone: 1 },
  },
  {
    id: 'lessons-4',
    name: 'Lessons',
    description: 'Play 1 Occupation (occupation cost: 2 food, the first two only 1 food each)',
    type: 'instant',
    allowsOccupation: true,
    occupationCost: 2,
    firstTwoOccupationsCost: 1, // First two occupations cost 1 food each
  },
  {
    id: 'traveling-players',
    name: 'Traveling Players',
    description: 'Accumulation Space: +1 Food',
    type: 'accumulating',
    accumulates: { food: 1 },
  },
]

// Additional action spaces for 5-6 player games
// These use the linked spaces mechanic from the expansion
const fiveSixPlayerActions = [
  {
    id: 'lessons-5',
    name: 'Lessons',
    description: 'Play 1 Occupation (occupation cost: 2 food)',
    type: 'instant',
    allowsOccupation: true,
    occupationCost: 2,
    linkedWith: 'copse-5',
  },
  {
    id: 'copse-5',
    name: 'Copse',
    description: 'Accumulation Space: +1 Wood',
    type: 'accumulating',
    accumulates: { wood: 1 },
    linkedWith: 'lessons-5',
  },
  {
    id: 'house-building',
    name: 'House Building',
    description: 'Build rooms (5 resources + 2 reed each)',
    type: 'instant',
    allowsHouseBuilding: true,
    linkedWith: 'traveling-players-5',
  },
  {
    id: 'traveling-players-5',
    name: 'Traveling Players',
    description: 'Accumulation Space: +1 Food',
    type: 'accumulating',
    accumulates: { food: 1 },
    linkedWith: 'house-building',
  },
  {
    id: 'lessons-5b',
    name: 'Lessons',
    description: 'Play 1 Occupation (occupation cost: 2 food, the first two only 1 food each)',
    type: 'instant',
    allowsOccupation: true,
    occupationCost: 2,
    firstTwoOccupationsCost: 1,
    linkedWith: 'modest-wish-for-children',
  },
  {
    id: 'modest-wish-for-children',
    name: 'Modest Wish for Children',
    description: 'Family Growth with Room Only (Round 5+)',
    type: 'instant',
    allowsFamilyGrowth: true,
    requiresRoom: true,
    minRound: 5,
    linkedWith: 'lessons-5b',
  },
  {
    id: 'grove-5',
    name: 'Grove',
    description: 'Accumulation Space: +2 Wood',
    type: 'accumulating',
    accumulates: { wood: 2 },
  },
  {
    id: 'hollow-5',
    name: 'Hollow',
    description: 'Accumulation Space: +2 Clay',
    type: 'accumulating',
    accumulates: { clay: 2 },
  },
  {
    id: 'resource-market-5',
    name: 'Resource Market',
    description: '1 Reed, 1 Stone, 1 Food',
    type: 'instant',
    gives: { food: 1, reed: 1, stone: 1 },
  },
]

// Additional action spaces for 6-player games only
const sixPlayerOnlyActions = [
  {
    id: 'riverbank-forest',
    name: 'Riverbank Forest',
    description: 'Accumulation Space: +1 Wood + 1 Reed instant',
    type: 'accumulating',
    accumulates: { wood: 1 },
    gives: { reed: 1 },
  },
  {
    id: 'grove-6',
    name: 'Grove',
    description: 'Accumulation Space: +2 Wood',
    type: 'accumulating',
    accumulates: { wood: 2 },
  },
  {
    id: 'hollow-6',
    name: 'Hollow',
    description: 'Accumulation Space: +3 Clay',
    type: 'accumulating',
    accumulates: { clay: 3 },
  },
  {
    id: 'resource-market-6',
    name: 'Resource Market',
    description: '1 Reed + 1 Stone + 1 Wood instant',
    type: 'instant',
    gives: { reed: 1, stone: 1, wood: 1 },
  },
  {
    id: 'animal-market',
    name: 'Animal Market',
    description: 'Choose: Sheep (+1 food) or Cattle (costs 1 food)',
    type: 'instant',
    allowsAnimalMarket: true,
  },
  {
    id: 'farm-supplies',
    name: 'Farm Supplies',
    description: '1 Grain for 1 Food, and/or Plow 1 Field for 1 Food',
    type: 'instant',
    allowsFarmSupplies: true,
  },
  {
    id: 'building-supplies',
    name: 'Building Supplies',
    description: '1 Food + (Reed or Stone) + (Wood or Clay)',
    type: 'instant',
    allowsBuildingSupplies: true,
  },
  {
    id: 'corral',
    name: 'Corral',
    description: 'Get animal you don\'t have (Sheep → Boar → Cattle order)',
    type: 'instant',
    allowsCorral: true,
  },
  {
    id: 'side-job',
    name: 'Side Job',
    description: 'Build 1 Stable for 1 Wood + optional Bake Bread',
    type: 'instant',
    allowsSideJob: true,
  },
  {
    id: 'improvement-6',
    name: 'Improvement',
    description: 'Minor Improvement (Major from Round 5+)',
    type: 'instant',
    allowsMinorImprovement: true,
    allowsMajorFromRound5: true,
  },
]

// Get additional actions for a specific player count
// Revised Edition: Different player counts have different action sets (not cumulative)
function getAdditionalActionsForPlayerCount(playerCount) {
  if (playerCount <= 2) {
    return []
  }
  if (playerCount === 3) {
    return threePlayerActions
  }
  if (playerCount === 4) {
    return fourPlayerActions
  }
  if (playerCount === 5) {
    return fiveSixPlayerActions
  }
  // 6 players get both 5-6 player actions and 6-player only actions
  return [...fiveSixPlayerActions, ...sixPlayerOnlyActions]
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
  for (const action of [
    ...threePlayerActions,
    ...fourPlayerActions,
    ...fiveSixPlayerActions,
    ...sixPlayerOnlyActions,
  ]) {
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
  fourPlayerActions,
  fiveSixPlayerActions,
  sixPlayerOnlyActions,
  getRoundCardsByStage,
  getAllActionSpaces,
  getBaseActions,
  getRoundCards,
  getActionById,
  createActionSpaceState,
  getAccumulationRates,
  getAdditionalActionsForPlayerCount,
}
