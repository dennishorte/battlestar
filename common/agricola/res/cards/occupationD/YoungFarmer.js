module.exports = {
  id: "young-farmer-d112",
  name: "Young Farmer",
  deck: "occupationD",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Major Improvement\" action space, you also get 1 grain and, afterward, you can take a \"Sow\" action.",
  matches_onAction(game, player, actionId) {
    return actionId === 'major-minor-improvement'
  },
  onAction(game, player, _actionId) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain',
      args: { player },
    })
    // Offer sow action if player has fields and crops to sow
    const emptyFields = player.getEmptyFields()
    if (emptyFields.length > 0 && (player.grain > 0 || player.vegetables > 0)) {
      const choices = ['Sow fields', 'Skip sowing']
      const selection = game.actions.choose(player, choices, {
        title: 'Young Farmer: Sow?',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Sow fields') {
        game.actions.sow(player)
      }
    }
  },
}
