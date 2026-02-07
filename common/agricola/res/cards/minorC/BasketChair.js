module.exports = {
  id: "basket-chair-c022",
  name: "Basket Chair",
  deck: "minorC",
  number: 22,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  category: "Actions Booster",
  text: "When you play this card, you can immediately move the first person you placed this work phase to this card. If you do, immediately afterward, you can place another person.",
  onPlay(game, player) {
    game.actions.basketChairEffect(player, this)
  },
}
