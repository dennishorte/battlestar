module.exports = {
  id: "bellfounder-d107",
  name: "Bellfounder",
  deck: "occupationD",
  number: 107,
  type: "occupation",
  players: "1+",
  text: "In the returning home phase of each round, if you have at least 1 clay, you can use this card to discard all of your clay and get your choice of 3 food or 1 bonus point.",
  onReturnHome(game, player) {
    if (player.clay >= 1) {
      const choices = ['3 food', '1 bonus point', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: `Bellfounder: Discard ${player.clay} clay for...`,
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Skip') {
        return
      }
      const discarded = player.clay
      player.clay = 0
      if (selection[0] === '3 food') {
        player.addResource('food', 3)
        game.log.add({
          template: '{player} discards {amount} clay for 3 food (Bellfounder)',
          args: { player, amount: discarded },
        })
      }
      else {
        player.bonusPoints = (player.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} discards {amount} clay for 1 bonus point (Bellfounder)',
          args: { player, amount: discarded },
        })
      }
    }
  },
}
