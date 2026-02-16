module.exports = {
  id: "second-spouse-c129",
  name: "Second Spouse",
  deck: "occupationC",
  number: 129,
  type: "occupation",
  players: "1+",
  text: "You can use the \"Urgent Wish for Children\" action space (from round 12-13) even if it is occupied by the first person another player placed.",
  canUseOccupiedActionSpace(game, player, actionId, _action, state) {
    if (actionId !== 'family-growth-urgent') {
      return false
    }
    if (state.occupiedBy === player.name) {
      return false
    }
    return state.personNumber === 1
  },
}
