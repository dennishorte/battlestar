module.exports = {
  id: "farm-store-c041",
  name: "Farm Store",
  deck: "minorC",
  number: 41,
  type: "minor",
  cost: { wood: 2, clay: 2 },
  category: "Building Resource Provider",
  text: "After the feeding phase of each harvest, you can exchange exactly 1 food for 2 different building resources of your choice or 1 vegetable.",
  onFeedingPhaseEnd(game, player) {
    if (player.food >= 1) {
      const choices = [
        '1 wood and 1 clay',
        '1 wood and 1 stone',
        '1 wood and 1 reed',
        '1 clay and 1 stone',
        '1 clay and 1 reed',
        '1 stone and 1 reed',
        '1 vegetable',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: 'Farm Store: Exchange 1 food',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: 1 })
        if (selection[0] === '1 vegetable') {
          player.addResource('vegetables', 1)
        }
        else {
          const parts = selection[0].split(' and ')
          const r1 = parts[0].split(' ')[1]
          const r2 = parts[1].split(' ')[1]
          player.addResource(r1, 1)
          player.addResource(r2, 1)
        }
        game.log.add({
          template: '{player} exchanges 1 food for {choice} using {card}',
          args: { player, choice: selection[0], card: this },
        })
      }
    }
  },
}
