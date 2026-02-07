module.exports = {
  id: "muck-rake-d029",
  name: "Muck Rake",
  deck: "minorD",
  number: 29,
  type: "minor",
  cost: { wood: 1 },
  category: "Points Provider",
  text: "During scoring, you get 1 bonus point for exactly 1 unfenced stable holding exactly 1 sheep. The same applies to wild boar and cattle, if held in different unfenced stables.",
  getEndGamePoints(player) {
    let points = 0
    const unfencedStables = player.getUnfencedStablesWithAnimals()
    const countByType = { sheep: 0, boar: 0, cattle: 0 }
    for (const stable of unfencedStables) {
      if (stable.animalCount === 1) {
        countByType[stable.animalType]++
      }
    }
    if (countByType.sheep === 1) {
      points++
    }
    if (countByType.boar === 1) {
      points++
    }
    if (countByType.cattle === 1) {
      points++
    }
    return points
  },
}
