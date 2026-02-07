module.exports = {
  id: "writing-chamber-c031",
  name: "Writing Chamber",
  deck: "minorC",
  number: 31,
  type: "minor",
  cost: { wood: 2 },
  category: "Points Provider",
  text: "During scoring, you get a number of bonus points equal to the total of negative points you have, to a maximum of 7 bonus points.",
  getEndGamePoints(player) {
    const negativePoints = player.calculateNegativePoints()
    return Math.min(Math.abs(negativePoints), 7)
  },
}
