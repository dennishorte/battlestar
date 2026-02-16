module.exports = {
  id: "smuggler-e142",
  name: "Smuggler",
  deck: "occupationE",
  number: 142,
  type: "occupation",
  players: "1+",
  text: "In the feeding phase of each harvest, you can exchange up to 2 goods as follows: 1 wood to 1 grain and/or 1 grain to 1 stone.",
  onFeedingPhase(game, player) {
    let exchangesLeft = 2

    while (exchangesLeft > 0) {
      const choices = []
      if (player.wood > 0) {
        choices.push('Exchange 1 wood for 1 grain')
      }
      if (player.grain > 0) {
        choices.push('Exchange 1 grain for 1 stone')
      }
      if (choices.length === 0) {
        break
      }
      choices.push('Done')

      const selection = game.actions.choose(player, choices, {
        title: `Smuggler: Exchange goods (${exchangesLeft} left)`,
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Done') {
        break
      }

      const choice = selection[0]
      if (choice.includes('wood for 1 grain')) {
        player.removeResource('wood', 1)
        player.addResource('grain', 1)
        game.log.add({ template: '{player} exchanges 1 wood for 1 grain (Smuggler)', args: { player } })
      }
      else if (choice.includes('grain for 1 stone')) {
        player.removeResource('grain', 1)
        player.addResource('stone', 1)
        game.log.add({ template: '{player} exchanges 1 grain for 1 stone (Smuggler)', args: { player } })
      }
      exchangesLeft--
    }
  },
}
