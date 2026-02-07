module.exports = {
  id: "lumber-pile-e076",
  name: "Lumber Pile",
  deck: "minorE",
  number: 76,
  type: "minor",
  cost: {},
  text: "When you play this card, you can immediately return up to 3 stables from your farmyard board to your supply and get 3 wood for each.",
  onPlay(game, player) {
    game.actions.lumberPileExchange(player, this)
  },
}
