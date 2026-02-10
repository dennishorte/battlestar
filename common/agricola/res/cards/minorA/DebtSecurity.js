module.exports = {
  id: "debt-security-a031",
  name: "Debt Security",
  deck: "minorA",
  number: 31,
  type: "minor",
  cost: { food: 2 },
  category: "Points Provider",
  text: "During scoring, you get 1 bonus point for each major improvement you have, up to the number of your unused farmyard spaces.",
  getEndGamePoints(player) {
    const majorCount = (player.majorImprovements || []).length
    const unusedSpaces = player.getUnusedSpaceCount()
    return Math.min(majorCount, unusedSpaces)
  },
}
