module.exports = {
  id: "knapper-a124",
  name: "Knapper",
  deck: "occupationA",
  number: 124,
  type: "occupation",
  players: "1+",
  text: "Each time before you use an action space card on round spaces 5 to 7, you get 1 stone.",
  matches_onBeforeAction(game, _player, actionId) {
    const actionRound = game.getActionSpaceRound(actionId)
    return actionRound >= 5 && actionRound <= 7
  },
  onBeforeAction(game, player, _actionId) {
    player.addResource('stone', 1)
    game.log.add({
      template: '{player} gets 1 stone',
      args: { player },
    })
  },
}
