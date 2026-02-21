module.exports = {
  id: "art-teacher-b155",
  name: "Art Teacher",
  deck: "occupationB",
  number: 155,
  type: "occupation",
  players: "4+",
  text: "When you play this card, you immediately get 1 wood and 1 reed. Each time you pay an occupation cost, you can use food from the \"Traveling Players\" accumulation space.",
  canUseTravelingPlayersFood: true,
  onPlay(game, player) {
    player.addResource('wood', 1)
    player.addResource('reed', 1)
    game.log.add({
      template: '{player} gets 1 wood and 1 reed from {card}',
      args: { player , card: this},
    })
  },
}
