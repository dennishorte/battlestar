module.exports = {
  id: "bed-maker-a093",
  name: "Bed Maker",
  deck: "occupationA",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "Each time you add rooms to your house, you can also pay 1 wood and 1 grain to immediately get a \"Family Growth with Room Only\" action.",
  onBuildRoom(game, player) {
    if (player.wood >= 1 && player.grain >= 1 && player.canGrowFamily()) {
      const card = this
      const choices = [
        'Pay 1 wood and 1 grain for Family Growth with Room Only',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Pay 1 wood and 1 grain for family growth?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 1, grain: 1 })
        game.actions.familyGrowth(player, true)
        game.log.add({
          template: '{player} pays 1 wood and 1 grain for family growth using {card}',
          args: { player, card: card },
        })
      }
    }
  },
}
