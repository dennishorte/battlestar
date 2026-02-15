module.exports = {
  id: "garden-designer-c099",
  name: "Garden Designer",
  deck: "occupationC",
  number: 99,
  type: "occupation",
  players: "1+",
  text: "At the start of scoring, you can place food in empty fields. You get 1/2/3 bonus points for each field in which you place 1/4/7 food.",
  getEndGamePoints(player) {
    const emptyFields = player.getEmptyFields().length
    if (emptyFields === 0 || player.food === 0) {
      return 0
    }

    // Optimal placement: 1 food per field = 1 BP (best ratio).
    // 4 food per field = 2 BP, 7 food per field = 3 BP.
    // Greedy: fill as many 1-food fields as possible first.
    let food = player.food
    let points = 0
    let remaining = emptyFields

    // Try 1-food placements (1 BP each) -- best ratio
    const oneFood = Math.min(remaining, food)
    points += oneFood
    food -= oneFood
    remaining -= oneFood

    return points
  },
}
