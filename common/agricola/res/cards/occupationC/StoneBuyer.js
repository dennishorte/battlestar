module.exports = {
  id: "stone-buyer-c143",
  name: "Stone Buyer",
  deck: "occupationC",
  number: 143,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you can immediately buy exactly 2 stone for 1 food. From the next round on, one per round, you can buy 1 stone for 2 food.",
  onPlay(game, player) {
    if (player.food >= 1) {
      game.actions.offerBuyStone(player, this, 2, 1)
    }
  },
  onRoundStart(game, player) {
    if (player.food >= 2) {
      game.actions.offerBuyStone(player, this, 1, 2)
    }
  },
}
