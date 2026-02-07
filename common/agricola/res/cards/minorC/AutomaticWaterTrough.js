module.exports = {
  id: "automatic-water-trough-c009",
  name: "Automatic Water Trough",
  deck: "minorC",
  number: 9,
  type: "minor",
  cost: { wood: 1 },
  category: "Livestock Provider",
  text: "If you can accommodate the animal, you can immediately buy 1 sheep/wild boar/cattle for 0/1/2 food.",
  onPlay(game, player) {
    game.actions.automaticWaterTroughPurchase(player, this)
  },
}
