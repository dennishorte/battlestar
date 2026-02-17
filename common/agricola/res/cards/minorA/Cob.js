module.exports = {
  id: "cob-a076",
  name: "Cob",
  deck: "minorA",
  number: 76,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "At the start of each work phase, if you have at least 1 clay in your supply, you can exchange exactly 1 grain for 2 clay and 1 food.",
  onWorkPhaseStart(game, player) {
    if (player.clay >= 1 && player.grain >= 1) {
      const card = this
      const choices = [
        'Exchange 1 grain for 2 clay and 1 food',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Exchange grain for clay and food?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ grain: 1 })
        player.addResource('clay', 2)
        player.addResource('food', 1)
        game.log.add({
          template: '{player} exchanges 1 grain for 2 clay and 1 food using {card}',
          args: { player, card },
        })
      }
    }
  },
}
