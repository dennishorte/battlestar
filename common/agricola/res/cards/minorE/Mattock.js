module.exports = {
  id: "mattock-e077",
  name: "Mattock",
  deck: "minorE",
  number: 77,
  type: "minor",
  cost: { wood: 1 },
  text: "Each time you get reed and/or stone from an action space, you get 1 additional clay.",
  matches_onAction(game, player, actionId, resources) {
    return resources && (resources.reed > 0 || resources.stone > 0)
  },
  onAction(game, player, _actionId, _resources) {
    player.addResource('clay', 1)
    game.log.add({
      template: '{player} gets 1 clay',
      args: { player },
    })
  },
}
