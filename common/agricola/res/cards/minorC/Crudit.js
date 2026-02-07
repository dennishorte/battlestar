module.exports = {
  id: "crudite-c057",
  name: "Crudité",
  deck: "minorC",
  number: 57,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "When you play this card, you can immediately buy exactly 1 vegetable for 3 food. At any time, you can discard 1 vegetable on top of another vegetable in a field to get 4 food.",
  allowsAnytimeExchange: true,
  cruditeEffect: true,
  onPlay(game, player) {
    if (player.food >= 3) {
      game.actions.offerCruditePurchase(player, this)
    }
  },
}
