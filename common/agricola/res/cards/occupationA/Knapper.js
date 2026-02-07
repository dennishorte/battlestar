module.exports = {
  id: "knapper-a124",
  name: "Knapper",
  deck: "occupationA",
  number: 124,
  type: "occupation",
  players: "1+",
  text: "Each time before you use an action space card on round spaces 5 to 7, you get 1 stone.",
  onBeforeAction(game, player, actionId) {
    const actionRound = game.getActionSpaceRound(actionId)
    if (actionRound >= 5 && actionRound <= 7) {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Knapper',
        args: { player },
      })
    }
  },
}
