module.exports = {
  id: "acquirer-e102",
  name: "Acquirer",
  deck: "occupationE",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you may pay food equal to the number of people you have to buy 1 good of your choice from the general supply.",
  onRoundStart(game, player) {
    const cost = player.getFamilySize()
    if (player.food >= cost) {
      const choices = ['1 wood', '1 clay', '1 reed', '1 stone', '1 grain', '1 vegetables', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: `Acquirer: Pay ${cost} food to buy 1 good?`,
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.removeResource('food', cost)
        const choice = selection[0]
        if (choice === '1 wood') {
          player.addResource('wood', 1)
        }
        else if (choice === '1 clay') {
          player.addResource('clay', 1)
        }
        else if (choice === '1 reed') {
          player.addResource('reed', 1)
        }
        else if (choice === '1 stone') {
          player.addResource('stone', 1)
        }
        else if (choice === '1 grain') {
          player.addResource('grain', 1)
        }
        else if (choice === '1 vegetables') {
          player.addResource('vegetables', 1)
        }
        game.log.add({
          template: '{player} pays {cost} food to acquire {choice} (Acquirer)',
          args: { player, cost, choice },
        })
      }
    }
  },
}
