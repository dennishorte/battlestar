module.exports = {
  id: "sculptor-d105",
  name: "Sculptor",
  deck: "occupationD",
  number: 105,
  type: "occupation",
  players: "1+",
  text: "Each time you use a clay accumulation space, you also get 1 food. Each time you use a stone accumulation space, you also get 1 grain.",
  onAction(game, player, actionId) {
    if (actionId === 'take-clay' || actionId === 'take-clay-2') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
    else if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
  },
}
