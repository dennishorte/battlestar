module.exports = {
  id: "cookery-outfitter-a101",
  name: "Cookery Outfitter",
  deck: "occupationA",
  number: 101,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each cooking improvement you have.",
  getEndGamePoints(player) {
    return player.getCookingImprovementCount()
  },
}
