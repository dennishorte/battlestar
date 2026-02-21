module.exports = {
  id: "nest-site-a049",
  name: "Nest Site",
  deck: "minorA",
  number: 49,
  type: "minor",
  cost: { food: 1 },
  prereqs: { occupations: 1 },
  category: "Food Provider",
  text: "Each time 1 reed is placed on a non-empty \"Reed Bank\" accumulation space during the preparation phase, you get 1 food.",
  onReedBankReplenish(game, player, wasNonEmpty) {
    if (wasNonEmpty) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
