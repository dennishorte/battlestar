module.exports = {
  id: "seatmate-b129",
  name: "Seatmate",
  deck: "occupationB",
  number: 129,
  type: "occupation",
  players: "1+",
  text: "You can use the action space on round space 13 even if it is occupied by one or more people of the players to your immediate left and right.",
  canUseOccupiedActionSpace(game, player, actionId, _action, state) {
    // Only for the round 13 action space
    if (game.getActionSpaceRound(actionId) !== 13) {
      return false
    }

    // Check if occupier is an immediate neighbor (left or right seat)
    const allPlayers = game.players.all()
    const myIndex = allPlayers.findIndex(p => p.name === player.name)
    const occupierIndex = allPlayers.findIndex(p => p.name === state.occupiedBy)
    if (myIndex < 0 || occupierIndex < 0) {
      return false
    }

    const n = allPlayers.length
    const leftIndex = (myIndex - 1 + n) % n
    const rightIndex = (myIndex + 1) % n

    return occupierIndex === leftIndex || occupierIndex === rightIndex
  },
}
