module.exports = {
  id: "roof-ballaster-b123",
  name: "Roof Ballaster",
  deck: "occupationB",
  number: 123,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you can immediately pay 1 food to get 1 stone for each room you have.",
  onPlay(game, player) {
    if (player.food >= 1) {
      game.actions.offerRoofBallasterBonus(player, this)
    }
  },
}
