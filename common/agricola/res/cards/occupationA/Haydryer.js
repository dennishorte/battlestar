module.exports = {
  id: "haydryer-a166",
  name: "Haydryer",
  deck: "occupationA",
  number: 166,
  type: "occupation",
  players: "4+",
  text: "Immediately before each harvest, you can buy 1 cattle for 4 food minus 1 food for each pasture you have. (The minimum cost is 0).",
  onBeforeHarvest(game, player) {
    const pastures = player.getPastureCount()
    const cost = Math.max(0, 4 - pastures)
    if (cost > 0 && (player.food < cost || !player.canPlaceAnimals('cattle', 1))) {
      return
    }
    if (cost === 0 && !player.canPlaceAnimals('cattle', 1)) {
      return
    }
    const cardName = 'Haydryer'
    const label = cost === 0 ? 'Buy 1 cattle for 0 food' : `Buy 1 cattle for ${cost} food`
    const choice = game.actions.choose(player, [label, 'Skip'], {
      title: `${cardName}: Buy 1 cattle (4 − pastures food, min 0)?`,
      min: 1,
      max: 1,
    })
    if (choice[0] === 'Skip') {
      return
    }
    if (cost > 0) {
      player.payCost({ food: cost })
    }
    player.addAnimals('cattle', 1)
    game.log.add({
      template: '{player} buys 1 cattle for {cost} food using {card}',
      args: { player, cost, card: cardName },
    })
  },
}
