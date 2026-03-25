module.exports = {
  id: "drift-net-boat-a051",
  name: "Drift-Net Boat",
  deck: "minorA",
  number: 51,
  type: "minor",
  cost: { wood: 1, reed: 1 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you use the \"Fishing\" accumulation space, you get an additional 2 food.",
  matches_onAction(game, player, actionId) {
    return actionId === 'fishing'
  },
  onAction(game, player, _actionId) {
    player.addResource('food', 2)
    game.log.add({
      template: '{player} gets 2 additional food',
      args: { player },
    })
  },
}
