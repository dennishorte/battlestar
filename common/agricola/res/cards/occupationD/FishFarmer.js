module.exports = {
  id: "fish-farmer-d110",
  name: "Fish Farmer",
  deck: "occupationD",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "Each time there is 1/2/3+ food on the \"Fishing\" accumulation space, you get an additional 2 food on the \"Reed Bank\"/ \"Clay Pit\"/ \"Forest\" accumulation spaces.",
  modifyAccumulation(game, player) {
    const fishingFood = game.getAccumulatedResources('fishing').food || 0
    if (fishingFood >= 3) {
      game.addBonusAccumulation(player, 'take-wood', { food: 2 })
    }
    if (fishingFood >= 2) {
      game.addBonusAccumulation(player, 'take-clay', { food: 2 })
    }
    if (fishingFood >= 1) {
      game.addBonusAccumulation(player, 'reed-bank', { food: 2 })
    }
  },
}
