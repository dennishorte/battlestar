module.exports = {
  id: "bargain-hunter-e152",
  name: "Bargain Hunter",
  deck: "occupationE",
  number: 152,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you can place 1 food from your supply on the \"Traveling Players\" accumulation space to play a minor improvement by paying its cost.",
  onRoundStart(game, player) {
    if (player.food >= 1) {
      const selection = game.actions.choose(player, ['Place 1 food and play minor', 'Skip'], {
        title: 'Bargain Hunter: Place food on Traveling Players?',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.removeResource('food', 1)
        const tpState = game.state.actionSpaces['traveling-players']
        if (tpState) {
          tpState.accumulated = (tpState.accumulated || 0) + 1
        }
        game.log.add({
          template: '{player} places 1 food on Traveling Players via Bargain Hunter',
          args: { player },
        })
        game.actions.buyMinorImprovement(player)
      }
    }
  },
}
