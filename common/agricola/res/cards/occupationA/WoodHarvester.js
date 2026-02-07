module.exports = {
  id: "wood-harvester-a104",
  name: "Wood Harvester",
  deck: "occupationA",
  number: 104,
  type: "occupation",
  players: "1+",
  text: "In the field phase of each harvest, you get 1 wood/1 food for each wood accumulation space with exactly 2 wood/at least 3 wood.",
  onFieldPhase(game, player) {
    const woodSpaces = game.getWoodAccumulationSpaces()
    let wood = 0
    let food = 0
    for (const space of woodSpaces) {
      const woodOnSpace = space.accumulated || 0
      if (woodOnSpace === 2) {
        wood++
      }
      else if (woodOnSpace >= 3) {
        food++
      }
    }
    if (wood > 0) {
      player.addResource('wood', wood)
      game.log.add({
        template: '{player} gets {amount} wood from Wood Harvester',
        args: { player, amount: wood },
      })
    }
    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Wood Harvester',
        args: { player, amount: food },
      })
    }
  },
}
