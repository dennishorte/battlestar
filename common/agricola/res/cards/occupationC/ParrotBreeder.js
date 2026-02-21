module.exports = {
  id: "parrot-breeder-c150",
  name: "Parrot Breeder",
  deck: "occupationC",
  number: 150,
  type: "occupation",
  players: "3+",
  text: "On your turn, if you pay 1 grain to the general supply, you can use the same action space that the player to your right has just used on their turn.",
  canUseOccupiedActionSpace(game, player, actionId, _action, state) {
    if (player.grain < 1) {
      return false
    }

    const rightPlayer = this._getPlayerToRight(game, player)
    if (!rightPlayer) {
      return false
    }

    return state.occupiedBy === rightPlayer.name && rightPlayer._lastActionId === actionId
  },

  onBeforeAction(game, player, actionId) {
    const state = game.state.actionSpaces[actionId]
    if (!state.previousOccupiedBy) {
      return
    }
    const rightPlayer = this._getPlayerToRight(game, player)
    if (rightPlayer && state.previousOccupiedBy === rightPlayer.name) {
      player.payCost({ grain: 1 })
      game.log.add({
        template: '{player} pays 1 grain to copy {action} via {card}',
        args: { player, action: actionId , card: this},
      })
    }
  },

  _getPlayerToRight(game, player) {
    const allPlayers = game.players.all()
    const myIndex = allPlayers.findIndex(p => p.name === player.name)
    if (myIndex < 0) {
      return null
    }
    const n = allPlayers.length
    const rightIndex = (myIndex + 1) % n
    return allPlayers[rightIndex]
  },
}
