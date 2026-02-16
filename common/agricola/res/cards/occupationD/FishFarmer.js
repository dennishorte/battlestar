module.exports = {
  id: "fish-farmer-d110",
  name: "Fish Farmer",
  deck: "occupationD",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "When you use Reed Bank, Clay Pit, or Forest, if there is at least 1/2/3 food on the Fishing space, you also get 2 food.",
  onAction(game, player, actionId) {
    const fishingFood = game.getAccumulatedResources('fishing').food || 0
    if (actionId === 'take-reed' && fishingFood >= 1) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Fish Farmer',
        args: { player },
      })
    }
    else if (actionId === 'take-clay' && fishingFood >= 2) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Fish Farmer',
        args: { player },
      })
    }
    else if (actionId === 'take-wood' && fishingFood >= 3) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Fish Farmer',
        args: { player },
      })
    }
  },
}
