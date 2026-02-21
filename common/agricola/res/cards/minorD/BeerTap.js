module.exports = {
  id: "beer-tap-d062",
  name: "Beer Tap",
  deck: "minorD",
  number: 62,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "When you play this card, you immediately get 2 food. In the feeding phase of each harvest, you can turn 2/3/4 grain into 3/6/9 food.",
  onPlay(game, player) {
    player.addResource('food', 2)
    game.log.add({
      template: '{player} gets 2 food from {card}',
      args: { player , card: this},
    })
  },
  onFeedingPhase(game, player) {
    if (player.grain >= 2) {
      const tiers = [
        { grain: 2, food: 3 },
        { grain: 3, food: 6 },
        { grain: 4, food: 9 },
      ]
      const affordable = tiers.filter(t => player.grain >= t.grain)
      const choices = affordable.map(t => `Convert ${t.grain} grain into ${t.food} food`)
      choices.push('Skip')
      const selection = game.actions.choose(player, choices, {
        title: 'Beer Tap',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        const tier = affordable.find(t =>
          selection[0] === `Convert ${t.grain} grain into ${t.food} food`
        )
        player.payCost({ grain: tier.grain })
        player.addResource('food', tier.food)
        game.log.add({
          template: '{player} converts {grain} grain into {food} food using {card}',
          args: { player, grain: tier.grain, food: tier.food, card: this },
        })
      }
    }
  },
}
