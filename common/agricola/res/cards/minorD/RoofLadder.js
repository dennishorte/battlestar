module.exports = {
  id: "roof-ladder-d081",
  name: "Roof Ladder",
  deck: "minorD",
  number: 81,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "Each time you renovate, you pay 1 fewer reed and, at the end of the action, you get 1 stone.",
  modifyRenovationCost(player, cost) {
    const newCost = { ...cost }
    if (newCost.reed) {
      newCost.reed = Math.max(0, newCost.reed - 1)
    }
    return newCost
  },
  onRenovate(game, player) {
    player.addResource('stone', 1)
    game.log.add({
      template: '{player} gets 1 stone from Roof Ladder',
      args: { player },
    })
  },
}
