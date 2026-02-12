module.exports = {
  id: "blade-shears-c007",
  name: "Blade Shears",
  deck: "minorC",
  number: 7,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { pastures: 1 },
  category: "Food Provider",
  text: "You immediately get your choice of 3 food or 1 food for each sheep you have. (Keep the sheep.)",
  onPlay(game, player) {
    const sheepCount = player.getTotalAnimals('sheep')
    const sheepFood = sheepCount

    // If sheep food <= 3, always take 3 (better or equal)
    if (sheepFood <= 3) {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from {card}',
        args: { player, card: this },
      })
      return
    }

    // Sheep food > 3: offer meaningful choice
    const selection = game.actions.choose(player, [
      'Get 3 food',
      `Get ${sheepFood} food (1 per sheep)`,
    ], { title: 'Blade Shears', min: 1, max: 1 })

    const foodGained = selection[0] === 'Get 3 food' ? 3 : sheepFood
    player.addResource('food', foodGained)
    game.log.add({
      template: '{player} gets {food} food from {card}',
      args: { player, food: foodGained, card: this },
    })
  },
}
