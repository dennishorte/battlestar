module.exports = {
  id: "roastmaster-e166",
  name: "Roastmaster",
  deck: "occupationE",
  number: 166,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Traveling Players\" or \"Fishing\" accumulation spaces, you can move exactly 1 food from that space to the other to get 1 cattle.",
  onAction(game, player, actionId) {
    if (actionId === 'traveling-players' || actionId === 'fishing') {
      if (player.food >= 1 && player.canPlaceAnimals('cattle', 1)) {
        const otherName = actionId === 'traveling-players' ? 'Fishing' : 'Traveling Players'
        const otherId = actionId === 'traveling-players' ? 'fishing' : 'traveling-players'
        const selection = game.actions.choose(player, [`Move 1 food to ${otherName}, get cattle`, 'Skip'], {
          title: 'Roastmaster: Move food for cattle?',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          player.removeResource('food', 1)
          const otherState = game.state.actionSpaces[otherId]
          if (otherState) {
            otherState.accumulated = (otherState.accumulated || 0) + 1
          }
          player.addAnimals('cattle', 1)
          game.log.add({
            template: '{player} moves 1 food to {other} and gets 1 cattle via Roastmaster',
            args: { player, other: otherName },
          })
        }
      }
    }
  },
}
