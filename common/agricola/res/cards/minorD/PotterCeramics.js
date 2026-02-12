module.exports = {
  id: "potter-ceramics-d066",
  name: "Potter Ceramics",
  deck: "minorD",
  number: 66,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "Each time before you take a \"Bake Bread\" action, you can exchange exactly 1 clay for 1 grain.",
  onBeforeBake(game, player) {
    if (player.clay >= 1) {
      const selection = game.actions.choose(player, [
        'Exchange 1 clay for 1 grain',
        'Skip',
      ], {
        title: 'Potter Ceramics',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ clay: 1 })
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} exchanges 1 clay for 1 grain using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
