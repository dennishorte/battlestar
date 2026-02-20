const boardLayout = require('../../boardLayout.js')

const ANIMAL_ACCUMULATION_IDS = ['take-sheep', 'take-boar', 'take-cattle']

module.exports = {
  id: "pig-stalker-d165",
  name: "Pig Stalker",
  deck: "occupationD",
  number: 165,
  type: "occupation",
  players: "1+",
  text: "Each time you use an animal accumulation space, if you occupy either the action space immediately above or below that accumulation space, you also get 1 wild boar.",
  onAction(game, player, actionId) {
    if (!ANIMAL_ACCUMULATION_IDS.includes(actionId)) {
      return
    }

    const playerCount = game.state.numPlayers
    const roundCardPositions = boardLayout.getActiveRoundCardPositions(
      game.state.roundCardDeck, playerCount, game.state.activeActions
    )

    const adjacent = boardLayout.getVerticallyAdjacentSpaces(actionId, playerCount, roundCardPositions)

    const hasOccupiedAdjacent = adjacent.some(adjId => {
      const spaceState = game.state.actionSpaces[adjId]
      return spaceState && spaceState.occupiedBy === player.name
    })

    if (hasOccupiedAdjacent) {
      player.addAnimals('boar', 1)
      game.log.add({
        template: '{player} gets 1 wild boar from Pig Stalker',
        args: { player },
      })
    }
  },
}
