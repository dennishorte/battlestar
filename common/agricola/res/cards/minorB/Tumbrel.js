module.exports = {
  id: "tumbrel-b054",
  name: "Tumbrel",
  deck: "minorB",
  number: 54,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "When you play this card, you immediately get 2 food. Each time after you take a \"Sow\" action, you get 1 food for each stable you have.",
  onPlay(game, player) {
    player.addResource('food', 2)
    game.log.add({
      template: '{player} gets 2 food from Tumbrel',
      args: { player },
    })
  },
  onSow(game, player) {
    const stables = player.getStableCount()
    if (stables > 0) {
      player.addResource('food', stables)
      game.log.add({
        template: '{player} gets {amount} food from Tumbrel',
        args: { player, amount: stables },
      })
    }
  },
}
