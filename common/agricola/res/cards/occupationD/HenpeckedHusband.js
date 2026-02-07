module.exports = {
  id: "henpecked-husband-d094",
  name: "Henpecked Husband",
  deck: "occupationD",
  number: 94,
  type: "occupation",
  players: "1+",
  text: "Each time you take a \"Build Rooms\" action with the second person you place, return the first person you placed home, unless it is on the \"Meeting Place\" action space.",
  onAction(game, player, actionId) {
    if (actionId === 'build-rooms' && player.getPersonPlacedThisRound() === 2) {
      const firstPersonAction = player.getFirstPersonActionThisRound()
      if (firstPersonAction !== 'meeting-place') {
        game.actions.returnWorkerHome(player, 0)
        game.log.add({
          template: '{player} returns first worker home via Henpecked Husband',
          args: { player },
        })
      }
    }
  },
}
