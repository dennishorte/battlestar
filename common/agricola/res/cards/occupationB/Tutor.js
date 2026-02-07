module.exports = {
  id: "tutor-b099",
  name: "Tutor",
  deck: "occupationB",
  number: 99,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each occupation played after this one.",
  getEndGamePoints(player) {
    return player.getOccupationsPlayedAfter(this.id)
  },
}
