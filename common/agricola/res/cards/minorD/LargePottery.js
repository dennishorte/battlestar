module.exports = {
  id: "large-pottery-d060",
  name: "Large Pottery",
  deck: "minorD",
  number: 60,
  type: "minor",
  cost: { clay: 1, stone: 1 },
  vps: 3,
  prereqs: {
    returnMajor: ["pottery"],
  },
  category: "Food Provider",
  text: "At any time, you can use the Large Pottery to convert 1 Clay to 2 Food. At the end of the game, you may spend 3/5/6/7 Clay from your supply to earn 1/2/3/4 bonus points.",
  anytimeConversions: [
    { from: "clay", to: "food", rate: 2 },
  ],
  getEndGamePoints(player) {
    const clay = player.clay
    if (clay >= 7) {
      return 4
    }
    if (clay >= 6) {
      return 3
    }
    if (clay >= 5) {
      return 2
    }
    if (clay >= 3) {
      return 1
    }
    return 0
  },
}
