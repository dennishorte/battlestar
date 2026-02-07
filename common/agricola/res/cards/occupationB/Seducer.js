module.exports = {
  id: "seducer-b127",
  name: "Seducer",
  deck: "occupationB",
  number: 127,
  type: "occupation",
  players: "1+",
  text: "When you play this card in Round 5 or later, you can immediately pay 1 stone, 1 grain, 1 vegetable, and 1 sheep to take a \"Family Growth Even without Room\" action.",
  onPlay(game, player) {
    if (game.state.round >= 5) {
      game.actions.offerSeducerGrowth(player, this)
    }
  },
}
