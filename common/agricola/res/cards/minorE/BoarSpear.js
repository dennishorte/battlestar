module.exports = {
  id: "boar-spear-e053",
  name: "Boar Spear",
  deck: "minorE",
  number: 53,
  type: "minor",
  cost: { wood: 1, stone: 1 },
  vps: 1,
  text: "Each time you get at least 1 wild boar outside of the breeding phase of a harvest, you can immediately turn them into 4 food each.",
  onGetBoar(game, player, count, isBreeding) {
    if (!isBreeding && count > 0) {
      game.actions.offerBoarSpear(player, this, count)
    }
  },
}
