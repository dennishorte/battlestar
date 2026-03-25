module.exports = {
  id: "henpecked-husband-d094",
  name: "Henpecked Husband",
  deck: "occupationD",
  number: 94,
  type: "occupation",
  players: "1+",
  text: "Each time you take a \"Build Rooms\" action with the second person you place, return the first person you placed home, unless it is on the \"Meeting Place\" action space.",
  matches_onAction(game, player, actionId) {
    return actionId === 'build-room-stable'
  },
  onAction(game, player, _actionId) {
    if (player.getPersonPlacedThisRound() === 2) {
      if (player.getFirstPersonActionThisRound() !== 'starting-player') {
        game.actions.returnWorkerHome(player, 0)
        game.log.add({
          template: '{player} returns first worker home',
          args: { player },
        })
      }
    }
  },
}
