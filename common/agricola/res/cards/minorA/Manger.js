module.exports = {
  id: "manger-a032",
  name: "Manger",
  deck: "minorA",
  number: 32,
  type: "minor",
  cost: { wood: 2 },
  category: "Points Provider",
  text: "During scoring, if your pastures cover at least 6/7/8/10 farmyard spaces, you get 1/2/3/4 bonus points.",
  getEndGamePoints(player) {
    const pastureSpaces = player.getPastureSpaceCount()
    if (pastureSpaces >= 10) {
      return 4
    }
    if (pastureSpaces >= 8) {
      return 3
    }
    if (pastureSpaces >= 7) {
      return 2
    }
    if (pastureSpaces >= 6) {
      return 1
    }
    return 0
  },
}
