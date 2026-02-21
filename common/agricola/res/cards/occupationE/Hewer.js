module.exports = {
  id: "hewer-e143",
  name: "Hewer",
  deck: "occupationE",
  number: 143,
  type: "occupation",
  players: "1+",
  text: "From round 3 on, at the end of each work phase in which all clay accumulation spaces are unoccupied, you get 1 stone and 1 food.",
  onWorkPhaseEnd(game, player) {
    if (game.state.round >= 3 && game.allClayAccumulationSpacesUnoccupied()) {
      player.addResource('stone', 1)
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 stone and 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
