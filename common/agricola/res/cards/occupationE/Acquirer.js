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
      const choices = [
        game.actions.option({ id: 'wood', title: '1 wood' }),
        game.actions.option({ id: 'clay', title: '1 clay' }),
        game.actions.option({ id: 'reed', title: '1 reed' }),
        game.actions.option({ id: 'stone', title: '1 stone' }),
        game.actions.option({ id: 'grain', title: '1 grain' }),
        game.actions.option({ id: 'vegetables', title: '1 vegetables' }),
        game.actions.option({ id: 'skip', title: 'Skip' }),
      ]
      const selection = game.actions.choose(player, choices, {
        title: `Acquirer: Pay ${cost} food to buy 1 good?`,
        min: 1,
        max: 1,
      })
      if (selection[0].id !== 'skip') {
        player.removeResource('food', cost)
        const choice = selection[0]
        player.addResource(choice.id, 1)
        game.log.add({
          template: '{player} pays {cost} food to acquire {choice} ({card})',
          args: { player, cost, choice: choice.title , card: this},
        })
      }
    }
  },
}
