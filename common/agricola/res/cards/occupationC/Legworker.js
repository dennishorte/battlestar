const boardLayout = require('../../boardLayout.js')

module.exports = {
  excluded: true,  // Only affects version 4.
  id: "legworker-c117",
  name: "Legworker",
  deck: "occupationC",
  number: 117,
  type: "occupation",
  players: "1+",
  text: "Each time you use an action space that is orthogonally adjacent to another action space occupied by one of your people, you get 1 wood.",
  onAction(game, player, actionId) {
    const playerCount = game.state.numPlayers
    const roundCardPositions = boardLayout.getActiveRoundCardPositions(
      game.state.roundCardDeck, playerCount, game.state.activeActions
    )

    const adjacent = boardLayout.getAdjacentSpaces(actionId, playerCount, roundCardPositions)

    const hasOwnOccupied = adjacent.some(adjId => {
      const spaceState = game.state.actionSpaces[adjId]
      return spaceState && spaceState.occupiedBy === player.name
    })

    if (hasOwnOccupied) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Legworker',
        args: { player },
      })
    }
  },
}
