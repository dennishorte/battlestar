module.exports = {
  id: "greening-plan-c033",
  name: "Greening Plan",
  deck: "minorC",
  number: 33,
  type: "minor",
  cost: { food: 3 },
  category: "Points Provider",
  text: "During scoring, if you then have at least 2/4/5/6 unplanted fields, you get 1/2/3/5 bonus points.",
  getEndGamePoints(player) {
    const emptyFields = player.getEmptyFields().length
    if (emptyFields >= 6) {
      return 5
    }
    if (emptyFields >= 5) {
      return 3
    }
    if (emptyFields >= 4) {
      return 2
    }
    if (emptyFields >= 2) {
      return 1
    }
    return 0
  },
}
