module.exports = {
  id: "beaver-colony-e033",
  name: "Beaver Colony",
  deck: "minorE",
  number: 33,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { fencedStables: 1 },
  text: "From now on, one of your pastures with stable cannot hold animals. Each time you get reed from an action space, you get 1 bonus point.",
  disablesPastureWithStable: true,
  onAction(game, player, actionId) {
    if (game.actionGivesReed(actionId)) {
      player.bonusPoints = (player.bonusPoints || 0) + 1
      game.log.add({
        template: '{player} gets 1 bonus point from Beaver Colony',
        args: { player },
      })
    }
  },
}
