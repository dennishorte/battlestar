module.exports = {
  id: "wool-blankets-a038",
  name: "Wool Blankets",
  deck: "minorA",
  number: 38,
  type: "minor",
  cost: {},
  prereqs: { sheep: 5 },
  category: "Points Provider",
  text: "During scoring, if you live in a wooden/clay/stone house by then, you get 3/2/0 bonus points.",
  getEndGamePoints(player) {
    if (player.roomType === 'wood') {
      return 3
    }
    if (player.roomType === 'clay') {
      return 2
    }
    return 0
  },
}
