module.exports = {
  id: "inner-districts-director-c093",
  name: "Inner Districts Director",
  deck: "occupationC",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Forest\" or \"Clay Pit\" accumulation space, you can place 1 stone from the general supply on the other space. If you do, you can immediately place another person.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'take-clay') {
      const otherSpace = actionId === 'take-wood' ? 'take-clay' : 'take-wood'
      const otherName = actionId === 'take-wood' ? 'Clay Pit' : 'Forest'
      const selection = game.actions.choose(player, () => [
        `Place 1 stone on ${otherName} and place another person`,
        'Do not place stone',
      ], { title: 'Inner Districts Director', min: 1, max: 1 })
      if (selection[0] !== 'Do not place stone') {
        // Add stone to the other accumulation space
        if (!game.state.actionSpaces[otherSpace]) {
          game.state.actionSpaces[otherSpace] = {}
        }
        game.state.actionSpaces[otherSpace].stone =
          (game.state.actionSpaces[otherSpace].stone || 0) + 1
        game.log.add({
          template: '{player} places 1 stone on {space} from {card}',
          args: { player, space: otherName , card: this},
        })
      }
    }
  },
}
