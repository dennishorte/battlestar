module.exports = {
  id: "roastmaster-e166",
  name: "Roastmaster",
  deck: "occupationE",
  number: 166,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Traveling Players\" or \"Fishing\" accumulation spaces, you can move exactly 1 food from that space to the other to get 1 cattle.",
  matches_onAction(game, player, actionId) {
    return actionId === 'traveling-players' || actionId === 'traveling-players-5' || actionId === 'fishing'
  },
  onAction(game, player, actionId) {
    if (player.food >= 1 && player.canPlaceAnimals('cattle', 1)) {
      const isTraveling = actionId === 'traveling-players' || actionId === 'traveling-players-5'
      const otherName = isTraveling ? 'Fishing' : 'Traveling Players'
      const otherId = isTraveling ? 'fishing' : 'traveling-players'
      const selection = game.actions.choose(player, [
        game.actions.option({ id: 'move', title: `Move 1 food to ${otherName}, get cattle` }),
        game.actions.option({ id: 'skip', title: 'Skip' }),
      ], {
        title: 'Roastmaster: Move food for cattle?',
        min: 1,
        max: 1,
      })
      if (selection[0].id !== 'skip') {
        player.removeResource('food', 1)
        const otherState = game.state.actionSpaces[otherId]
        if (otherState) {
          otherState.accumulated = (otherState.accumulated || 0) + 1
        }
        game.actions.handleAnimalPlacement(player, { cattle: 1 })
        game.log.add({
          template: '{player} moves 1 food to {other} and gets 1 cattle',
          args: { player, other: otherName },
        })
      }
    }
  },
}
