module.exports = {
  id: "young-farmer-d112",
  name: "Young Farmer",
  deck: "occupationD",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Major Improvement\" action space, you also get 1 grain and, afterward, you can take a \"Sow\" action.",
  onAction(game, player, actionId) {
    if (actionId === 'major-improvement') {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Young Farmer',
        args: { player },
      })
      game.actions.offerSow(player, this)
    }
  },
}
