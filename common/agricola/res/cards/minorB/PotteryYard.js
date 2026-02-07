module.exports = {
  id: "pottery-yard-b031",
  name: "Pottery Yard",
  deck: "minorB",
  number: 31,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { hasPotteryOrUpgrade: true },
  category: "Points Provider",
  text: "During scoring, if there at least 2 orthogonally adjacent unused spaces in your farmyard, you get 2 bonus points. (You still get the negative points for those unused spaces.)",
  getEndGamePoints(player) {
    if (player.hasAdjacentUnusedSpaces(2)) {
      return 2
    }
    return 0
  },
}
