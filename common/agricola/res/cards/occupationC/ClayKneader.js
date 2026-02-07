module.exports = {
  id: "clay-kneader-c121",
  name: "Clay Kneader",
  deck: "occupationC",
  number: 121,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 wood and 2 clay. Each time after you use a \"Grain Seeds\" or \"Vegetable Seeds\" action space, you get 1 clay.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    player.addResource('clay', 2)
    game.log.add({
      template: '{player} gets 1 wood and 2 clay from Clay Kneader',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'take-grain' || actionId === 'take-vegetables') {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from Clay Kneader',
        args: { player },
      })
    }
  },
}
