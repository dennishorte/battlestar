module.exports = {
  id: "autumn-mother-c092",
  name: "Autumn Mother",
  deck: "occupationC",
  number: 92,
  type: "occupation",
  players: "1+",
  text: "Immediately before each harvest, if you have room in your house, you can take a \"Family Growth\" action for 3 food.",
  onBeforeHarvest(game, player) {
    const hasRoom = player.getRoomCount() > player.getFamilySize()
    if (hasRoom && player.food >= 3) {
      const selection = game.actions.choose(player, () => [
        'Pay 3 food for family growth',
        'Skip',
      ], { title: 'Autumn Mother', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: 3 })
        game.actions.familyGrowthWithoutRoom(player)
        game.log.add({
          template: '{player} grows family via {card} for 3 food',
          args: { player , card: this},
        })
      }
    }
  },
}
