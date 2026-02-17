module.exports = {
  id: "beer-stein-c061",
  name: "Beer Stein",
  deck: "minorC",
  number: 61,
  type: "minor",
  cost: { clay: 1 },
  category: "Food Provider",
  text: "Each time you take a \"Bake Bread\" action, you can use this card once to turn 1 grain into 2 food and 1 bonus point.",
  onBake(game, player) {
    if (player.grain >= 1) {
      const selection = game.actions.choose(player, [
        'Turn 1 grain into 2 food and 1 bonus point',
        'Skip',
      ], {
        title: 'Beer Stein',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ grain: 1 })
        player.addResource('food', 2)
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} turns 1 grain into 2 food and 1 bonus point using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
