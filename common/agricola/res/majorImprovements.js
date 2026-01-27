// Agricola Major Improvements Definitions

const majorImprovements = [
  // Fireplaces - basic cooking/baking
  {
    id: 'fireplace-2',
    name: 'Fireplace',
    cost: { clay: 2 },
    victoryPoints: 1,
    upgradesTo: ['cooking-hearth-4', 'cooking-hearth-5'],
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
    description: 'Convert animals/vegetables to food anytime. Bake: 1 grain -> 2 food.',
  },
  {
    id: 'fireplace-3',
    name: 'Fireplace',
    cost: { clay: 3 },
    victoryPoints: 1,
    upgradesTo: ['cooking-hearth-4', 'cooking-hearth-5'],
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
    description: 'Convert animals/vegetables to food anytime. Bake: 1 grain -> 2 food.',
  },

  // Cooking Hearths - upgraded cooking
  {
    id: 'cooking-hearth-4',
    name: 'Cooking Hearth',
    cost: { clay: 4 },
    victoryPoints: 1,
    upgradesFrom: ['fireplace-2', 'fireplace-3'],
    upgradesTo: [],
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
    description: 'Better conversion rates. Bake: 1 grain -> 3 food.',
  },
  {
    id: 'cooking-hearth-5',
    name: 'Cooking Hearth',
    cost: { clay: 5 },
    victoryPoints: 1,
    upgradesFrom: ['fireplace-2', 'fireplace-3'],
    upgradesTo: [],
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
    description: 'Better conversion rates. Bake: 1 grain -> 3 food.',
  },

  // Ovens - specialized baking
  {
    id: 'clay-oven',
    name: 'Clay Oven',
    cost: { clay: 3, stone: 1 },
    victoryPoints: 2,
    abilities: {
      canBake: true,
      bakingRate: 5, // 1 grain -> 5 food
      bakingLimit: 1, // Only 1 grain per bake action
    },
    description: 'Bake: 1 grain -> 5 food (once per bake action).',
  },
  {
    id: 'stone-oven',
    name: 'Stone Oven',
    cost: { clay: 1, stone: 3 },
    victoryPoints: 3,
    abilities: {
      canBake: true,
      bakingRate: 4, // up to 2 grain -> 4 food each
      bakingLimit: 2,
    },
    description: 'Bake: up to 2 grain -> 4 food each.',
  },

  // Crafting improvements - harvest bonuses
  {
    id: 'joinery',
    name: 'Joinery',
    cost: { wood: 2, stone: 2 },
    victoryPoints: 2,
    abilities: {
      harvestConversion: {
        resource: 'wood',
        food: 2,
        limit: 1,
      },
      endGameBonus: {
        resource: 'wood',
        thresholds: [0, 0, 1, 2, 3], // 0, 1-2, 3-4, 5-6, 7+ wood
      },
    },
    description: 'Harvest: convert 1 wood -> 2 food. End game: bonus points for wood (up to 3).',
  },
  {
    id: 'pottery',
    name: 'Pottery',
    cost: { clay: 2, stone: 2 },
    victoryPoints: 2,
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
    description: 'Harvest: convert 1 clay -> 2 food. End game: bonus points for clay (up to 3).',
  },
  {
    id: 'basketmakers-workshop',
    name: "Basketmaker's Workshop",
    cost: { reed: 2, stone: 2 },
    victoryPoints: 2,
    abilities: {
      harvestConversion: {
        resource: 'reed',
        food: 3,
        limit: 1,
      },
      endGameBonus: {
        resource: 'reed',
        thresholds: [0, 0, 1, 2, 3],
      },
    },
    description: 'Harvest: convert 1 reed -> 3 food. End game: bonus points for reed (up to 3).',
  },

  // Well - food over time
  {
    id: 'well',
    name: 'Well',
    cost: { wood: 1, stone: 3 },
    victoryPoints: 4,
    abilities: {
      wellEffect: true, // Places 1 food on next 5 round spaces
    },
    description: 'Place 1 food on each of the next 5 round spaces. Receive when those rounds begin.',
  },
]

// Get all major improvements
function getAllMajorImprovements() {
  return majorImprovements
}

// Get improvement by ID
function getMajorImprovementById(id) {
  return majorImprovements.find(imp => imp.id === id)
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
