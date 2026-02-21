module.exports = {
  id: "mayor-candidate-e124",
  name: "Mayor Candidate",
  deck: "occupationE",
  number: 124,
  type: "occupation",
  players: "1+",
  text: "You immediately get 2 wood and 2 stone. During scoring, you get 1 negative point for each wood and each stone in your supply. You can no longer discard wood or stone.",
  onPlay(game, player) {
    player.addResource('wood', 2)
    player.addResource('stone', 2)
    player.cannotDiscardWoodOrStone = true
    game.log.add({
      template: '{player} gets 2 wood and 2 stone from {card}',
      args: { player , card: this},
    })
  },
  getEndGamePoints(player) {
    return -(player.wood + player.stone)
  },
}
