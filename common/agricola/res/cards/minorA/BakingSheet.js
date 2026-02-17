module.exports = {
  id: "baking-sheet-a030",
  name: "Baking Sheet",
  deck: "minorA",
  number: 30,
  type: "minor",
  cost: {},
  prereqs: { noGrainFields: true },
  category: "Food Provider",
  text: "Each time you take a \"Bake Bread\" action, you can use this card to exchange exactly 1 grain for 2 food and 1 bonus point.",
  onBake(game, player) {
    if (player.grain >= 1) {
      const card = this
      const choices = [
        'Exchange 1 grain for 2 food and 1 bonus point',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Exchange grain for food and bonus point?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ grain: 1 })
        player.addResource('food', 2)
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} exchanges 1 grain for 2 food and 1 bonus point using {card}',
          args: { player, card },
        })
      }
    }
  },
}
