module.exports = {
  id: "riverine-shepherd-a137",
  name: "Riverine Shepherd",
  deck: "occupationA",
  number: 137,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Sheep Market\" or \"Reed Bank\" accumulation space, you can also take 1 good from the respective other accumulation space, if possible.",
  onAction(game, player, actionId) {
    if (actionId === 'take-sheep') {
      const reedOnBank = game.getAccumulatedResources('take-reed').reed || 0
      if (reedOnBank > 0) {
        game.removeFromAccumulationSpace('take-reed', 'reed', 1)
        player.addResource('reed', 1)
        game.log.add({
          template: '{player} takes 1 reed from Reed Bank via Riverine Shepherd',
          args: { player },
        })
      }
    }
    else if (actionId === 'take-reed') {
      const sheepOnMarket = game.getAccumulatedResources('take-sheep').sheep || 0
      if (sheepOnMarket > 0) {
        game.removeFromAccumulationSpace('take-sheep', 'sheep', 1)
        player.addAnimals('sheep', 1)
        game.log.add({
          template: '{player} takes 1 sheep from Sheep Market via Riverine Shepherd',
          args: { player },
        })
      }
    }
  },
}
