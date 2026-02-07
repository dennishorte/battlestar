module.exports = {
  id: "housemaster-b153",
  name: "Housemaster",
  deck: "occupationB",
  number: 153,
  type: "occupation",
  players: "3+",
  text: "During scoring, total the values of your major improvements. The smallest value counts double. If the total is at least 5/7/9/11, you get 1/2/3/4 bonus points.",
  getEndGamePoints(player) {
    const majorValues = player.getMajorImprovementValues()
    if (majorValues.length === 0) {
      return 0
    }
    const minValue = Math.min(...majorValues)
    const total = majorValues.reduce((a, b) => a + b, 0) + minValue // smallest counts double
    if (total >= 11) {
      return 4
    }
    if (total >= 9) {
      return 3
    }
    if (total >= 7) {
      return 2
    }
    if (total >= 5) {
      return 1
    }
    return 0
  },
}
