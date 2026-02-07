module.exports = {
  id: "misanthropy-e035",
  name: "Misanthropy",
  deck: "minorE",
  number: 35,
  type: "minor",
  cost: { wood: 1 },
  text: "During scoring, if you have exactly 4/3/2 people, you get 2/3/5 bonus points.",
  getEndGamePoints(player) {
    const people = player.getFamilySize()
    if (people === 4) {
      return 2
    }
    if (people === 3) {
      return 3
    }
    if (people === 2) {
      return 5
    }
    return 0
  },
}
