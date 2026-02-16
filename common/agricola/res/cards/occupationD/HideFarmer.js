module.exports = {
  id: "hide-farmer-d132",
  name: "Hide Farmer",
  deck: "occupationD",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "During scoring, you can pay 1 food each for any number of unused farmyard spaces. You do not lose points for these spaces.",
  getEndGamePoints(player, game) {
    const unusedSpaces = player.getUnusedSpaceCount()
    if (unusedSpaces === 0 || player.food === 0) {
      return 0
    }
    // Pay 1 food per unused space (always optimal: avoids -1 penalty for 1 food)
    const spacesPaidFor = Math.min(player.food, unusedSpaces)
    player.food -= spacesPaidFor
    game.log.add({
      template: '{player} pays {amount} food to Hide Farmer for {spaces} unused spaces',
      args: { player, amount: spacesPaidFor, spaces: spacesPaidFor },
    })
    return spacesPaidFor
  },
}
