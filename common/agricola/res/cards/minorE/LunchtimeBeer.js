module.exports = {
  id: "lunchtime-beer-e058",
  name: "Lunchtime Beer",
  deck: "minorE",
  number: 58,
  type: "minor",
  cost: {},
  text: "At the start of each harvest, you can choose to skip the field and breeding phase of that harvest and get exactly 1 food instead.",
  onHarvestStart(game, player) {
    game.actions.offerLunchtimeBeer(player, this)
  },
}
