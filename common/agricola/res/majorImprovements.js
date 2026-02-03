// Agricola Major Improvements Definitions

const majorImprovements = [
  // Fireplaces - basic cooking/baking
  {
    id: 'fireplace-2',
    name: 'Fireplace',
    type: 'major',
    cost: { clay: 2 },
    victoryPoints: 1,
    upgradesTo: ['cooking-hearth-4', 'cooking-hearth-5'],
    text: [
      'At any time: Vegetable \u2192 2 Food; Sheep \u2192 2 Food; Wild boar \u2192 2 Food; Cattle \u2192 3 Food',
      '"Bake Bread" action: Grain \u2192 2 Food',
    ],
    abilities: {
      canCook: true,
      canBake: true,
      cookingRates: {
        sheep: 2,
        boar: 2,
        cattle: 3,
        vegetables: 2,
      },
      bakingRate: 2, // 1 grain -> 2 food
    },
  },
  {
    id: 'fireplace-3',
    name: 'Fireplace',
    type: 'major',
    cost: { clay: 3 },
    victoryPoints: 1,
    upgradesTo: ['cooking-hearth-4', 'cooking-hearth-5'],
    text: [
      'At any time: Vegetable \u2192 2 Food; Sheep \u2192 2 Food; Wild boar \u2192 2 Food; Cattle \u2192 3 Food',
      '"Bake Bread" action: Grain \u2192 2 Food',
    ],
    abilities: {
      canCook: true,
      canBake: true,
      cookingRates: {
        sheep: 2,
        boar: 2,
        cattle: 3,
        vegetables: 2,
      },
      bakingRate: 2,
    },
  },

  // Cooking Hearths - upgraded cooking
  {
    id: 'cooking-hearth-4',
    name: 'Cooking Hearth',
    type: 'major',
    cost: { clay: 4 },
    victoryPoints: 1,
    upgradesFrom: ['fireplace-2', 'fireplace-3'],
    upgradesTo: [],
    text: [
      'At any time: Vegetable \u2192 3 Food; Sheep \u2192 2 Food; Wild boar \u2192 3 Food; Cattle \u2192 4 Food',
      '"Bake Bread" action: Grain \u2192 3 Food',
    ],
    alternateCost: 'Return a Fireplace',
    abilities: {
      canCook: true,
      canBake: true,
      cookingRates: {
        sheep: 2,
        boar: 3,
        cattle: 4,
        vegetables: 3,
      },
      bakingRate: 3, // 1 grain -> 3 food
    },
  },
  {
    id: 'cooking-hearth-5',
    name: 'Cooking Hearth',
    type: 'major',
    cost: { clay: 5 },
    victoryPoints: 1,
    upgradesFrom: ['fireplace-2', 'fireplace-3'],
    upgradesTo: [],
    text: [
      'At any time: Vegetable \u2192 3 Food; Sheep \u2192 2 Food; Wild boar \u2192 3 Food; Cattle \u2192 4 Food',
      '"Bake Bread" action: Grain \u2192 3 Food',
    ],
    alternateCost: 'Return a Fireplace',
    abilities: {
      canCook: true,
      canBake: true,
      cookingRates: {
        sheep: 2,
        boar: 3,
        cattle: 4,
        vegetables: 3,
      },
      bakingRate: 3,
    },
  },

  // Ovens - specialized baking
  {
    id: 'clay-oven',
    name: 'Clay Oven',
    type: 'major',
    cost: { clay: 3, stone: 1 },
    victoryPoints: 2,
    text: [
      '"Bake Bread" action: At most 1 time Grain \u2192 5 Food',
      'When you build this improvement, you can immediately take a "Bake Bread" action.',
    ],
    abilities: {
      canBake: true,
      bakingRate: 5, // 1 grain -> 5 food
      bakingLimit: 1, // Only 1 grain per bake action
      bakeBreadOnBuild: true,
    },
  },
  {
    id: 'stone-oven',
    name: 'Stone Oven',
    type: 'major',
    cost: { clay: 1, stone: 3 },
    victoryPoints: 3,
    text: [
      '"Bake Bread" action: Up to 2 times Grain \u2192 4 Food',
      'When you build this improvement, you can immediately take a "Bake Bread" action.',
    ],
    abilities: {
      canBake: true,
      bakingRate: 4, // up to 2 grain -> 4 food each
      bakingLimit: 2,
      bakeBreadOnBuild: true,
    },
  },

  // Crafting improvements - harvest bonuses
  {
    id: 'joinery',
    name: 'Joinery',
    type: 'major',
    cost: { wood: 2, stone: 2 },
    victoryPoints: 2,
    text: [
      'Harvest: At most 1 time Wood \u2192 2 Food',
      'Scoring: 3/5/7 Wood \u2192 1/2/3 bonus points',
    ],
    abilities: {
      harvestConversion: {
        resource: 'wood',
        food: 2,
        limit: 1,
      },
      endGameBonus: {
        resource: 'wood',
        thresholds: [0, 0, 1, 2, 3], // 0-2, 3-4, 5-6, 7+ wood
      },
    },
  },
  {
    id: 'pottery',
    name: 'Pottery',
    type: 'major',
    cost: { clay: 2, stone: 2 },
    victoryPoints: 2,
    text: [
      'Harvest: At most 1 time Clay \u2192 2 Food',
      'Scoring: 3/5/7 Clay \u2192 1/2/3 bonus points',
    ],
    abilities: {
      harvestConversion: {
        resource: 'clay',
        food: 2,
        limit: 1,
      },
      endGameBonus: {
        resource: 'clay',
        thresholds: [0, 0, 1, 2, 3],
      },
    },
  },
  {
    id: 'basketmakers-workshop',
    name: "Basketmaker's Workshop",
    type: 'major',
    cost: { reed: 2, stone: 2 },
    victoryPoints: 2,
    text: [
      'Harvest: At most 1 time Reed \u2192 3 Food',
      'Scoring: 2/4/5 Reed \u2192 1/2/3 bonus points',
    ],
    abilities: {
      harvestConversion: {
        resource: 'reed',
        food: 3,
        limit: 1,
      },
      endGameBonus: {
        resource: 'reed',
        thresholds: [0, 1, 2, 3], // 0-1, 2-3, 4, 5+ reed (different from others)
      },
    },
  },

  // Well - food over time
  {
    id: 'well',
    name: 'Well',
    type: 'major',
    cost: { wood: 1, stone: 3 },
    victoryPoints: 4,
    text: [
      'Place 1 food on each of the next 5 round spaces. At the start of these rounds, you get the food.',
    ],
    abilities: {
      wellEffect: true, // Places 1 food on next 5 round spaces
    },
  },
]

// Additional major improvements for 6-player games
// More expensive versions of existing improvements
const sixPlayerMajorImprovements = [
  {
    id: 'fireplace-4',
    name: 'Fireplace',
    type: 'major',
    cost: { clay: 4 },
    victoryPoints: 1,
    expansion: '5-6',
    upgradesTo: ['cooking-hearth-4', 'cooking-hearth-5', 'cooking-hearth-6'],
    text: [
      'At any time: Vegetable → 2 Food; Sheep → 2 Food; Wild boar → 2 Food; Cattle → 3 Food',
      '"Bake Bread" action: Grain → 2 Food',
    ],
    abilities: {
      canCook: true,
      canBake: true,
      cookingRates: {
        sheep: 2,
        boar: 2,
        cattle: 3,
        vegetables: 2,
      },
      bakingRate: 2,
    },
  },
  {
    id: 'cooking-hearth-6',
    name: 'Cooking Hearth',
    type: 'major',
    cost: { clay: 6 },
    victoryPoints: 1,
    expansion: '5-6',
    upgradesFrom: ['fireplace-2', 'fireplace-3', 'fireplace-4'],
    upgradesTo: [],
    text: [
      'At any time: Vegetable → 3 Food; Sheep → 2 Food; Wild boar → 3 Food; Cattle → 4 Food',
      '"Bake Bread" action: Grain → 3 Food',
    ],
    alternateCost: 'Return a Fireplace',
    abilities: {
      canCook: true,
      canBake: true,
      cookingRates: {
        sheep: 2,
        boar: 3,
        cattle: 4,
        vegetables: 3,
      },
      bakingRate: 3,
    },
  },
  {
    id: 'well-2',
    name: 'Well',
    type: 'major',
    cost: { stone: 3, clay: 1 },
    victoryPoints: 4,
    expansion: '5-6',
    text: [
      'Place 1 food on each of the next 5 round spaces. At the start of these rounds, you get the food.',
    ],
    abilities: {
      wellEffect: true,
    },
  },
  {
    id: 'clay-oven-2',
    name: 'Clay Oven',
    type: 'major',
    cost: { clay: 4, stone: 1 },
    victoryPoints: 2,
    expansion: '5-6',
    text: [
      '"Bake Bread" action: At most 1 time Grain → 5 Food',
      'When you build this improvement, you can immediately take a "Bake Bread" action.',
    ],
    abilities: {
      canBake: true,
      bakingRate: 5,
      bakingLimit: 1,
      bakeBreadOnBuild: true,
    },
  },
  {
    id: 'stone-oven-2',
    name: 'Stone Oven',
    type: 'major',
    cost: { clay: 2, stone: 3 },
    victoryPoints: 3,
    expansion: '5-6',
    text: [
      '"Bake Bread" action: Up to 2 times Grain → 4 Food',
      'When you build this improvement, you can immediately take a "Bake Bread" action.',
    ],
    abilities: {
      canBake: true,
      bakingRate: 4,
      bakingLimit: 2,
      bakeBreadOnBuild: true,
    },
  },
  {
    id: 'joinery-2',
    name: 'Joinery',
    type: 'major',
    cost: { wood: 2, stone: 3 },
    victoryPoints: 2,
    expansion: '5-6',
    text: [
      'Harvest: At most 1 time Wood → 2 Food',
      'Scoring: 3/5/7 Wood → 1/2/3 bonus points',
    ],
    abilities: {
      harvestConversion: {
        resource: 'wood',
        food: 2,
        limit: 1,
      },
      endGameBonus: {
        resource: 'wood',
        thresholds: [0, 0, 1, 2, 3],
      },
    },
  },
  {
    id: 'pottery-2',
    name: 'Pottery',
    type: 'major',
    cost: { clay: 2, stone: 3 },
    victoryPoints: 2,
    expansion: '5-6',
    text: [
      'Harvest: At most 1 time Clay → 2 Food',
      'Scoring: 3/5/7 Clay → 1/2/3 bonus points',
    ],
    abilities: {
      harvestConversion: {
        resource: 'clay',
        food: 2,
        limit: 1,
      },
      endGameBonus: {
        resource: 'clay',
        thresholds: [0, 0, 1, 2, 3],
      },
    },
  },
  {
    id: 'basketmakers-workshop-2',
    name: "Basketmaker's Workshop",
    type: 'major',
    cost: { reed: 2, stone: 3 },
    victoryPoints: 2,
    expansion: '5-6',
    text: [
      'Harvest: At most 1 time Reed → 3 Food',
      'Scoring: 2/4/5 Reed → 1/2/3 bonus points',
    ],
    abilities: {
      harvestConversion: {
        resource: 'reed',
        food: 3,
        limit: 1,
      },
      endGameBonus: {
        resource: 'reed',
        thresholds: [0, 1, 2, 3],
      },
    },
  },
]

// Get all major improvements
// Pass playerCount to include 6-player expansion improvements
function getAllMajorImprovements(playerCount = 4) {
  if (playerCount >= 6) {
    return [...majorImprovements, ...sixPlayerMajorImprovements]
  }
  return majorImprovements
}

// Get improvement by ID
function getMajorImprovementById(id) {
  const base = majorImprovements.find(imp => imp.id === id)
  if (base) {
    return base
  }
  return sixPlayerMajorImprovements.find(imp => imp.id === id)
}

// Get improvement by name (may return first match for duplicate names like "Fireplace")
function getMajorImprovementByName(name) {
  return majorImprovements.find(imp => imp.name === name)
}

// Get available improvements (not yet purchased)
function getAvailableImprovements(purchasedIds) {
  return majorImprovements.filter(imp => !purchasedIds.includes(imp.id))
}

// Check if player can afford improvement
function canAffordImprovement(improvement, playerResources) {
  for (const [resource, amount] of Object.entries(improvement.cost)) {
    if (!playerResources[resource] || playerResources[resource] < amount) {
      return false
    }
  }
  return true
}

// Check if player can upgrade to this improvement
function canUpgradeTo(improvement, playerImprovements) {
  if (!improvement.upgradesFrom || improvement.upgradesFrom.length === 0) {
    return false
  }
  return improvement.upgradesFrom.some(fromId => playerImprovements.includes(fromId))
}

// Get improvements that can cook animals
function getCookingImprovements() {
  return majorImprovements.filter(imp => imp.abilities && imp.abilities.canCook)
}

// Get improvements that can bake bread
function getBakingImprovements() {
  return majorImprovements.filter(imp => imp.abilities && imp.abilities.canBake)
}

// Calculate food from cooking an animal/vegetable
function calculateCookingFood(improvement, animalType, count = 1) {
  if (!improvement.abilities || !improvement.abilities.cookingRates) {
    return 0
  }
  const rate = improvement.abilities.cookingRates[animalType]
  return rate ? rate * count : 0
}

// Calculate food from baking grain
function calculateBakingFood(improvement, grainCount) {
  if (!improvement.abilities || !improvement.abilities.canBake) {
    return 0
  }
  const limit = improvement.abilities.bakingLimit || grainCount
  const actualGrain = Math.min(grainCount, limit)
  return actualGrain * improvement.abilities.bakingRate
}

// Calculate bonus points for crafting improvements
function calculateCraftingBonus(improvement, resourceCount) {
  if (!improvement.abilities || !improvement.abilities.endGameBonus) {
    return 0
  }
  const thresholds = improvement.abilities.endGameBonus.thresholds
  if (resourceCount >= 7) {
    return thresholds[4] || 0
  }
  if (resourceCount >= 5) {
    return thresholds[3] || 0
  }
  if (resourceCount >= 3) {
    return thresholds[2] || 0
  }
  if (resourceCount >= 1) {
    return thresholds[1] || 0
  }
  return thresholds[0] || 0
}

module.exports = {
  majorImprovements,
  sixPlayerMajorImprovements,
  getAllMajorImprovements,
  getMajorImprovementById,
  getMajorImprovementByName,
  getAvailableImprovements,
  canAffordImprovement,
  canUpgradeTo,
  getCookingImprovements,
  getBakingImprovements,
  calculateCookingFood,
  calculateBakingFood,
  calculateCraftingBonus,
}
