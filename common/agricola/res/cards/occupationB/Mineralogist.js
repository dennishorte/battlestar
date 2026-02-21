module.exports = {
  id: "mineralogist-b122",
  name: "Mineralogist",
  deck: "occupationB",
  number: 122,
  type: "occupation",
  players: "1+",
  text: "Each time you use a clay/stone accumulation space, you also get 1 of the other good, stone/clay.",
  onAction(game, player, actionId) {
    if (actionId === 'take-clay' || actionId === 'take-clay-2') {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from {card}',
        args: { player , card: this},
      })
    }
    else if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from {card}',
        args: { player , card: this},
      })
    }
  },
}
