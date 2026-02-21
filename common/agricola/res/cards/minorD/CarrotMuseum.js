module.exports = {
  id: "carrot-museum-d079",
  name: "Carrot Museum",
  deck: "minorD",
  number: 79,
  type: "minor",
  cost: { wood: 1, clay: 2 },
  vps: 2,
  prereqs: { maxRound: 8 },
  category: "Building Resource Provider",
  text: "At the end of rounds 8, 10, and 12, you get 1 stone for each vegetable field you have and a number of wood equal to the number of vegetables in your supply.",
  onRoundEnd(game, player, round) {
    if (round === 8 || round === 10 || round === 12) {
      const vegFields = player.getVegetableFieldCount()
      const vegetables = player.vegetables
      if (vegFields > 0) {
        player.addResource('stone', vegFields)
        game.log.add({
          template: '{player} gets {amount} stone from {card}',
          args: { player, amount: vegFields , card: this},
        })
      }
      if (vegetables > 0) {
        player.addResource('wood', vegetables)
        game.log.add({
          template: '{player} gets {amount} wood from {card}',
          args: { player, amount: vegetables , card: this},
        })
      }
    }
  },
}
