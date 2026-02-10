/**
 * HarvestMixin - Helper functions for harvest phase operations
 *
 * Provides utility functions for field harvesting, feeding, and breeding.
 */

const res = require('../res/index.js')

const HarvestMixin = {

  // Calculate how much food is needed for the entire family
  calculateFoodNeeded(player) {
    let needed = 0

    for (let i = 1; i <= player.familyMembers; i++) {
      if (player.newborns.includes(i)) {
        needed += res.constants.foodPerNewborn
      }
      else {
        needed += res.constants.foodPerFamilyMember
      }
    }

    return needed
  },

  // Calculate the food shortage (how much more food is needed)
  calculateFoodShortage(player) {
    const needed = this.calculateFoodNeeded(player)
    return Math.max(0, needed - player.food)
  },

  // Get all available food conversion options
  getFoodConversionOptions(player) {
    const options = []

    // Basic conversions (1:1)
    if (player.grain > 0) {
      options.push({
        type: 'convert',
        resource: 'grain',
        count: 1,
        food: 1,
        description: 'Convert 1 grain to 1 food',
      })
    }

    if (player.vegetables > 0) {
      options.push({
        type: 'convert',
        resource: 'vegetables',
        count: 1,
        food: 1,
        description: 'Convert 1 vegetable to 1 food',
      })
    }

    // Cooking (requires improvement)
    if (player.hasCookingAbility()) {
      const imp = player.getCookingImprovement()
      const rates = imp.abilities.cookingRates
      const animals = player.getAllAnimals()

      for (const [type, count] of Object.entries(animals)) {
        if (count > 0) {
          options.push({
            type: 'cook',
            resource: type,
            count: 1,
            food: rates[type],
            description: `Cook 1 ${type} for ${rates[type]} food`,
          })
        }
      }

      if (player.vegetables > 0) {
        options.push({
          type: 'cook',
          resource: 'vegetables',
          count: 1,
          food: rates.vegetables,
          description: `Cook 1 vegetable for ${rates.vegetables} food`,
        })
      }
    }

    // Crafting improvements (harvest conversion)
    for (const impId of player.majorImprovements) {
      const imp = this.cards.byId(impId)
      if (imp && imp.abilities && imp.abilities.harvestConversion) {
        const conv = imp.abilities.harvestConversion
        if (player[conv.resource] > 0) {
          options.push({
            type: 'craft',
            improvement: impId,
            resource: conv.resource,
            count: 1,
            food: conv.food,
            description: `Use ${imp.name}: ${conv.resource} -> ${conv.food} food`,
          })
        }
      }
    }

    return options
  },

  // Execute a food conversion
  executeFoodConversion(player, option) {
    if (option.type === 'convert') {
      player.removeResource(option.resource, option.count)
      player.addResource('food', option.food)
      return option.food
    }

    if (option.type === 'cook') {
      if (res.animalTypes.includes(option.resource)) {
        player.removeAnimals(option.resource, option.count)
      }
      else {
        player.removeResource(option.resource, option.count)
      }
      player.addResource('food', option.food)
      return option.food
    }

    if (option.type === 'craft') {
      player.removeResource(option.resource, option.count)
      player.addResource('food', option.food)
      return option.food
    }

    return 0
  },

  // Calculate potential breeding results
  calculateBreedingPotential(player) {
    const potential = {}

    for (const type of res.animalTypes) {
      const count = player.getTotalAnimals(type)
      potential[type] = {
        currentCount: count,
        canBreed: count >= 2,
        canHouse: player.canPlaceAnimals(type, 1),
        willBreed: count >= 2 && player.canPlaceAnimals(type, 1),
      }
    }

    return potential
  },

  // Get summary of harvest phase results
  getHarvestSummary(player, harvestResults) {
    return {
      fieldsHarvested: harvestResults.harvested || { grain: 0, vegetables: 0 },
      foodNeeded: harvestResults.foodNeeded || 0,
      foodAvailable: harvestResults.foodAvailable || 0,
      beggingCards: harvestResults.beggingCards || 0,
      animalsBred: harvestResults.bred || { sheep: 0, boar: 0, cattle: 0 },
    }
  },

  // Check if player will survive harvest without begging
  canSurviveHarvest(player) {
    const needed = this.calculateFoodNeeded(player)

    // Calculate total potential food
    let potentialFood = player.food
    potentialFood += player.grain // Basic conversion
    potentialFood += player.vegetables // Basic conversion

    // Add cooking potential
    if (player.hasCookingAbility()) {
      const imp = player.getCookingImprovement()
      const rates = imp.abilities.cookingRates
      const animals = player.getAllAnimals()

      for (const [type, count] of Object.entries(animals)) {
        potentialFood += count * rates[type]
      }
    }

    // Add crafting improvement potential
    for (const impId of player.majorImprovements) {
      const imp = this.cards.byId(impId)
      if (imp && imp.abilities && imp.abilities.harvestConversion) {
        const conv = imp.abilities.harvestConversion
        potentialFood += Math.min(player[conv.resource], conv.limit || 1) * conv.food
      }
    }

    return potentialFood >= needed
  },

  // Estimate harvest timing
  getNextHarvestRound(currentRound) {
    for (const harvestRound of res.constants.harvestRounds) {
      if (harvestRound > currentRound) {
        return harvestRound
      }
    }
    return null
  },

  // Get rounds until next harvest
  getRoundsUntilHarvest(currentRound) {
    const nextHarvest = this.getNextHarvestRound(currentRound)
    if (nextHarvest) {
      return nextHarvest - currentRound
    }
    return 0
  },
}

module.exports = { HarvestMixin }
