module.exports = {
  id: "wood-rake-d032",
  name: "Wood Rake",
  deck: "minorD",
  number: 32,
  type: "minor",
  cost: { wood: 1 },
  category: "Points Provider",
  text: "During scoring, if you had at least 7 goods in your fields before the final harvest, you get 2 bonus points.",
  getEndGamePoints(player) {
    if (player.goodsInFieldsBeforeFinalHarvest >= 7) {
      return 2
    }
    return 0
  },
}
