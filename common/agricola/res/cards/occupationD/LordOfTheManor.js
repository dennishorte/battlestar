module.exports = {
  id: "lord-of-the-manor-d100",
  name: "Lord of the Manor",
  deck: "occupationD",
  number: 100,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each scoring category in which you score the maximum 4 points. (The bonus point is also awarded for 4 fenced stables.)",
  getEndGamePoints(player) {
    return player.getCategoriesWithMaxScore()
  },
}
