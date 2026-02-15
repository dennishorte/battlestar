module.exports = {
  id: "tutor-b099",
  name: "Tutor",
  deck: "occupationB",
  number: 99,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each occupation played after this one.",
  getEndGamePoints(player) {
    const idx = player.playedOccupations.indexOf(this.id)
    if (idx < 0) {
      return 0
    }
    return player.playedOccupations.length - idx - 1
  },
}
