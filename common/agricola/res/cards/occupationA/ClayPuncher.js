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
      template: '{player} gets 1 clay from {card}',
      args: { player , card: this},
    })
  },
  onAction(game, player, actionId) {
    // Lessons A uses 'occupation', Lessons B/C use 'lessons-3', 'lessons-4', etc.
    const isLessonsAction = actionId === 'occupation' || actionId.startsWith('lessons-')
    if (isLessonsAction || actionId === 'take-clay') {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from {card}',
        args: { player , card: this},
      })
    }
  },
}
