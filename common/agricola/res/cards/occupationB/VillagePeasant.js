module.exports = {
  id: "village-peasant-b133",
  name: "Village Peasant",
  deck: "occupationB",
  number: 133,
  type: "occupation",
  players: "1+",
  text: "At the start of scoring, you get a number of vegetables equal to the smallest of the numbers of major improvements, minor improvements, and occupations you have.",
  // onScoring hook doesn't exist in engine; use getEndGamePoints to compute
  // the score difference from extra vegetables.
  getEndGamePoints(player) {
    const minCount = Math.min(
      player.majorImprovements.length,
      player.playedMinorImprovements.length,
      player.getOccupationCount()
    )
    if (minCount <= 0) {
      return 0
    }

    // Vegetable scoring: 0→-1, 1→1, 2→2, 3→3, 4+→4
    function vegScore(n) {
      if (n >= 4) {
        return 4
      }
      if (n >= 3) {
        return 3
      }
      if (n >= 2) {
        return 2
      }
      if (n >= 1) {
        return 1
      }
      return -1
    }

    const current = player.vegetables
    return vegScore(current + minCount) - vegScore(current)
  },
}
