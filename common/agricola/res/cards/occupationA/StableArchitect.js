module.exports = {
  id: "stable-architect-a098",
  name: "Stable Architect",
  deck: "occupationA",
  number: 98,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each unfenced stable in your farmyard.",
  getEndGamePoints(player) {
    return player.getUnfencedStableCount()
  },
}
