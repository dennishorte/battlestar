module.exports = {
  id: "pavior-b110",
  name: "Pavior",
  deck: "occupationB",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "At the end of each preparation phase, if you have at least 1 stone in your supply, you get 1 food. In round 14, you get 1 vegetable instead.",
  onRoundStart(game, player) {
    if (player.stone >= 1) {
      if (game.state.round === 14) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from {card}',
          args: { player , card: this},
        })
      }
      else {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
