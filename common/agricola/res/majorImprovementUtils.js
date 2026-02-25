// Utility functions for major improvements
// These operate on card objects and don't depend on the card definitions array.

const major = require('./cards/major')

// Get available improvements (not yet purchased)
function getAvailableImprovements(purchasedIds) {
  return major.getMajorImprovements().filter(imp => !purchasedIds.includes(imp.id))
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
  return major.getMajorImprovements().filter(imp => imp.abilities && imp.abilities.canCook)
}

// Get improvements that can bake bread
function getBakingImprovements() {
  return major.getMajorImprovements().filter(imp => imp.abilities && imp.abilities.canBake)
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
  getAvailableImprovements,
  canAffordImprovement,
  canUpgradeTo,
  getCookingImprovements,
  getBakingImprovements,
  calculateCookingFood,
  calculateBakingFood,
  calculateCraftingBonus,
}
