function countEmptyUnfencedStables(player) {
  let count = 0
  for (const stable of player.getStableSpaces()) {
    if (!player.getPastureAtSpace(stable.row, stable.col) && !stable.animal) {
      count++
    }
  }
  return count
}

module.exports = {
  id: "beer-stall-c049",
  name: "Beer Stall",
  deck: "minorC",
  number: 49,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "In the feeding phase of each harvest, for each empty unfenced stable you have, you can exchange 1 grain for 5 food.",
  harvestConversion: {
    resource: 'grain',
    food: 5,
    limit(_game, player) {
      return countEmptyUnfencedStables(player)
    },
  },
}
