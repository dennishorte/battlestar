module.exports = {
  id: "furniture-maker-c116",
  name: "Furniture Maker",
  deck: "occupationC",
  number: 116,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 wood. Each time you play an occupation after this one, you get 1 wood for each food paid as occupation cost.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Furniture Maker',
      args: { player },
    })
  },
  onPlayOccupation(game, player, foodPaid) {
    if (foodPaid > 0) {
      player.addResource('wood', foodPaid)
      game.log.add({
        template: '{player} gets {amount} wood from Furniture Maker',
        args: { player, amount: foodPaid },
      })
    }
  },
}
