module.exports = {
  id: "mummys-boy-a130",
  name: "Mummy's Boy",
  deck: "occupationA",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "Once per round, when placing a person after your first two, you can place it on the action space with your 2nd person and use that space again. (Mark the action space).",
  allowsDoubleAction: true,
  canUseOccupiedActionSpace(game, player, _actionId, _action, state) {
    if (state.occupiedBy !== player.name) {
      return false
    }
    const workersAlreadyPlaced = player.getFamilySize() - player.getAvailableWorkers()
    if (workersAlreadyPlaced < 2) {
      return false
    }
    return !player._usedMummysBoyDoubleAction
  },
}
