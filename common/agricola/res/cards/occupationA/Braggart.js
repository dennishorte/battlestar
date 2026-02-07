module.exports = {
  id: "braggart-a133",
  name: "Braggart",
  deck: "occupationA",
  number: 133,
  type: "occupation",
  players: "3+",
  text: "During the scoring, you get 2/3/4/5/7/9 bonus points for having at least 5/6/7/8/9/10 improvements in front of you.",
  getEndGamePoints(player) {
    const improvements = player.getImprovementCount()
    if (improvements >= 10) {
      return 9
    }
    if (improvements >= 9) {
      return 7
    }
    if (improvements >= 8) {
      return 5
    }
    if (improvements >= 7) {
      return 4
    }
    if (improvements >= 6) {
      return 3
    }
    if (improvements >= 5) {
      return 2
    }
    return 0
  },
}
