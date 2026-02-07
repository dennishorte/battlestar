module.exports = {
  id: "old-miser-e159",
  name: "Old Miser",
  deck: "occupationE",
  number: 159,
  type: "occupation",
  players: "1+",
  text: "In the feeding phase of each harvest, each of your people requires 1 less food. During scoring, your people are worth 2 points each instead of 3.",
  modifyFeedingRequirement(player, requirement) {
    return Math.max(0, requirement - player.getFamilySize())
  },
  modifyPersonPoints() {
    return 2
  },
}
