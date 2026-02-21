module.exports = {
  id: "wood-carrier-a117",
  name: "Wood Carrier",
  deck: "occupationA",
  number: 117,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 wood for each improvement in front of you.",
  onPlay(game, player) {
    const improvements = player.getImprovementCount()
    if (improvements > 0) {
      player.addResource('wood', improvements)
      game.log.add({
        template: '{player} gets {amount} wood from {card}',
        args: { player, amount: improvements , card: this},
      })
    }
  },
}
