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
  onPlayOccupation(game, player, _card) {
    // The occupation count now includes the just-played card, so the cost
    // for that card was based on count-1 (before it was added).
    // First occupation is free, subsequent cost 1 food each (base).
    const occCount = player.getOccupationCount()
    // The card just played was the occCount'th. First is free, rest cost 1 food.
    const foodPaid = occCount > 1 ? 1 : 0
    if (foodPaid > 0) {
      player.addResource('wood', foodPaid)
      game.log.add({
        template: '{player} gets {amount} wood from Furniture Maker',
        args: { player, amount: foodPaid },
      })
    }
  },
}
