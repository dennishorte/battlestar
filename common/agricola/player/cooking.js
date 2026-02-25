const { AgricolaPlayer } = require('../AgricolaPlayer.js')
const res = require('../res/index.js')


AgricolaPlayer.prototype.getFoodRequired = function() {
  let required = 0
  for (let i = 1; i <= this.familyMembers; i++) {
    if (this.newborns.includes(i)) {
      required += res.constants.foodPerNewborn
    }
    else {
      required += res.constants.foodPerFamilyMember
    }
  }
  return required
}

AgricolaPlayer.prototype.feedFamily = function() {
  const required = this.getFoodRequired()
  const shortage = Math.max(0, required - this.food)

  if (shortage > 0) {
    this.removeResource('food', this.food)
    this.addResource('beggingCards', shortage)
  }
  else {
    this.removeResource('food', required)
  }

  return { required, fed: required - shortage, beggingCards: shortage }
}

// ---------------------------------------------------------------------------
// Cooking and Baking methods
// ---------------------------------------------------------------------------

AgricolaPlayer.prototype.hasCookingAbility = function() {
  return this.majorImprovements.some(id => {
    const imp = this.cards.byId(id)
    return imp && imp.cookingRates
  })
}

AgricolaPlayer.prototype.hasBakingAbility = function() {
  const allIds = [...this.majorImprovements, ...this.playedMinorImprovements]
  return allIds.some(id => {
    const card = this.cards.byId(id)
    return card && card.bakingConversion
  })
}

AgricolaPlayer.prototype.getCookingImprovement = function() {
  for (const id of this.majorImprovements) {
    const imp = this.cards.byId(id)
    if (imp && imp.cookingRates) {
      return imp
    }
  }
  return null
}

AgricolaPlayer.prototype.getBakingImprovement = function() {
  let best = null
  const allIds = [...this.majorImprovements, ...this.playedMinorImprovements]
  for (const id of allIds) {
    const card = this.cards.byId(id)
    if (card && card.bakingConversion) {
      if (!best || card.bakingConversion.rate > best.bakingConversion.rate) {
        best = card
      }
    }
  }
  return best
}

AgricolaPlayer.prototype.cookAnimal = function(animalType, count = 1) {
  const imp = this.getCookingImprovement()
  if (!imp) {
    return 0
  }

  const available = this.getTotalAnimals(animalType)
  const toCook = Math.min(count, available)

  if (toCook > 0) {
    this.removeAnimals(animalType, toCook)
    const food = imp.cookingRates[animalType] * toCook
    this.addResource('food', food)
    return food
  }
  return 0
}

AgricolaPlayer.prototype.cookVegetable = function(count = 1) {
  const imp = this.getCookingImprovement()
  if (!imp) {
    return 0
  }

  const toCook = Math.min(count, this.vegetables)
  if (toCook > 0) {
    this.removeResource('vegetables', toCook)
    const food = imp.cookingRates.vegetables * toCook
    this.addResource('food', food)
    return food
  }
  return 0
}

AgricolaPlayer.prototype.bakeGrain = function(count = 1) {
  const imp = this.getBakingImprovement()
  if (!imp) {
    return 0
  }

  const limit = imp.bakingConversion.limit || count
  const toBake = Math.min(count, this.grain, limit)

  if (toBake > 0) {
    this.removeResource('grain', toBake)
    const food = toBake * imp.bakingConversion.rate
    this.addResource('food', food)
    return food
  }
  return 0
}

// Converts grain or vegetables to food without improvement (1:1 ratio)
AgricolaPlayer.prototype.convertToFood = function(resourceType, count = 1) {
  const available = this[resourceType]
  const toConvert = Math.min(count, available)

  if (toConvert > 0) {
    this.removeResource(resourceType, toConvert)
    this.addResource('food', toConvert)
    return toConvert
  }
  return 0
}
