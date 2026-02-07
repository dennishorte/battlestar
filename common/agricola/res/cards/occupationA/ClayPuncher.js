module.exports = {
  id: "clay-puncher-a121",
  name: "Clay Puncher",
  deck: "occupationA",
  number: 121,
  type: "occupation",
  players: "1+",
  text: "When you play this card and each time after you use a \"Lessons\" action space or the \"Clay Pit\" accumulation space, you get 1 clay.",
  onPlay(game, player) {
    player.addResource('clay', 1)
    game.log.add({
      template: '{player} gets 1 clay from Clay Puncher',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'lessons-1' || actionId === 'lessons-2' || actionId === 'take-clay') {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from Clay Puncher',
        args: { player },
      })
    }
  },
}
