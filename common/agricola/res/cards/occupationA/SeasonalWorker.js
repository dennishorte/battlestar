module.exports = {
  id: "seasonal-worker-a114",
  name: "Seasonal Worker",
  deck: "occupationA",
  number: 114,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Day Laborer\" action space, you get 1 additional grain. From Round 6 on, you can choose to get 1 vegetable instead.",
  matches_onAction(game, player, actionId) {
    return actionId === 'day-laborer'
  },
  onAction(game, player, _actionId) {
    if (game.state.round >= 6) {
      game.actions.offerResourceChoice(player, this, ['grain', 'vegetables'])
    }
    else {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain',
        args: { player },
      })
    }
  },
}
