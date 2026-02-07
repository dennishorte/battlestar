module.exports = {
  id: "porter-d146",
  name: "Porter",
  deck: "occupationD",
  number: 146,
  type: "occupation",
  players: "1+",
  text: "Each time you take at least 4 of the same building resource from an accumulation space, you get 1 additional building resource of the accumulating type and 1 food.",
  onAction(game, player, actionId) {
    if (game.isAccumulationSpace(actionId)) {
      const resources = game.getAccumulatedResources(actionId)
      for (const [resource, amount] of Object.entries(resources)) {
        if (['wood', 'clay', 'reed', 'stone'].includes(resource) && amount >= 4) {
          player.addResource(resource, 1)
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 {resource} and 1 food from Porter',
            args: { player, resource },
          })
          break
        }
      }
    }
  },
}
