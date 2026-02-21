module.exports = {
  id: "studio-c055",
  name: "Studio",
  deck: "minorC",
  number: 55,
  type: "minor",
  cost: { clay: 1, reed: 1 },
  vps: 1,
  category: "Food Provider",
  text: "In the feeding phase of each harvest, you can use this card to turn exactly 1 wood/clay/stone into 2/2/3 food.",
  onFeedingPhase(game, player) {
    if (player.wood >= 1 || player.clay >= 1 || player.stone >= 1) {
      const choices = []
      if (player.wood >= 1) {
        choices.push('Convert 1 wood into 2 food')
      }
      if (player.clay >= 1) {
        choices.push('Convert 1 clay into 2 food')
      }
      if (player.stone >= 1) {
        choices.push('Convert 1 stone into 3 food')
      }
      choices.push('Skip')
      const selection = game.actions.choose(player, choices, {
        title: 'Studio',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Convert 1 wood into 2 food') {
        player.payCost({ wood: 1 })
        player.addResource('food', 2)
      }
      else if (selection[0] === 'Convert 1 clay into 2 food') {
        player.payCost({ clay: 1 })
        player.addResource('food', 2)
      }
      else if (selection[0] === 'Convert 1 stone into 3 food') {
        player.payCost({ stone: 1 })
        player.addResource('food', 3)
      }
      if (selection[0] !== 'Skip') {
        game.log.add({
          template: '{player} uses {card} to convert a resource into food',
          args: { player , card: this},
        })
      }
    }
  },
}
