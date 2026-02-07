module.exports = {
  id: "water-worker-d144",
  name: "Water Worker",
  deck: "occupationD",
  number: 144,
  type: "occupation",
  players: "1+",
  text: "Each time after you use the \"Fishing\" accumulation space or one of the three orthogonally adjacent actions spaces, you get 1 additional reed.",
  onAction(game, player, actionId) {
    const adjacentActions = game.getAdjacentActionSpaces('fishing')
    if (actionId === 'fishing' || adjacentActions.includes(actionId)) {
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from Water Worker',
        args: { player },
      })
    }
  },
}
