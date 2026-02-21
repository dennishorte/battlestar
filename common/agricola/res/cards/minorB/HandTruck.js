module.exports = {
  id: "hand-truck-b067",
  name: "Hand Truck",
  deck: "minorB",
  number: 67,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "Each time before you take a \"Bake Bread\" action, you also get 1 grain for each of your people occupying an accumulation space.",
  onBake(game, player) {
    const count = player.getPeopleOnAccumulationSpaces()
    if (count > 0) {
      player.addResource('grain', count)
      game.log.add({
        template: '{player} gets {amount} grain from {card}',
        args: { player, amount: count , card: this},
      })
    }
  },
}
