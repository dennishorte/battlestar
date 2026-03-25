module.exports = {
  id: "merchant-c096",
  name: "Merchant",
  deck: "occupationC",
  number: 96,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you take a \"Major or Minor Improvement\" or \"Minor Improvement\" action, you can pay 1 food to take the action a second time.",
  matches_onAction(game, player, actionId) {
    return actionId === 'major-minor-improvement' || actionId === 'minor-improvement' || actionId === 'improvement-6'
  },
  onAction(game, player, _actionId) {
    if (player.food >= 1) {
      const selection = game.actions.choose(player, () => [
        'Pay 1 food to take improvement action again',
        'Skip',
      ], { title: 'Merchant', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: 1 })
        game.actions.buyImprovement(player, true, true)
        game.log.add({
          template: '{player} pays 1 food for extra improvement',
          args: { player },
        })
      }
    }
  },
}
