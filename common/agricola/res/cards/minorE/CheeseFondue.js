module.exports = {
  id: "cheese-fondue-e057",
  name: "Cheese Fondue",
  deck: "minorE",
  number: 57,
  type: "minor",
  cost: { clay: 1 },
  vps: 1,
  text: "Each time you bake at least 1 grain into bread, you get 1 additional food if you have at least 1 sheep and (another) 1 additional food if you have at least 1 cattle.",
  onBake(game, player, grainBaked) {
    if (grainBaked > 0) {
      let bonus = 0
      if (player.getTotalAnimals('sheep') >= 1) {
        bonus++
      }
      if (player.getTotalAnimals('cattle') >= 1) {
        bonus++
      }
      if (bonus > 0) {
        player.addResource('food', bonus)
        game.log.add({
          template: '{player} gets {amount} bonus food from {card}',
          args: { player, amount: bonus , card: this},
        })
      }
    }
  },
}
