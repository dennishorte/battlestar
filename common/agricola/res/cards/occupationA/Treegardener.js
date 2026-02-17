module.exports = {
  id: "treegardener-a118",
  name: "Treegardener",
  deck: "occupationA",
  number: 118,
  type: "occupation",
  players: "1+",
  text: "In the field phase of each harvest, you get 1 wood and you can buy up to 2 additional wood for 1 food each.",
  onFieldPhase(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Treegardener',
      args: { player },
    })
    if (player.food >= 1) {
      const card = this
      const maxWood = 2
      const foodPerWood = 1
      const choices = ['Skip']
      for (let n = 1; n <= maxWood && player.food >= n * foodPerWood; n++) {
        choices.unshift(`Buy ${n} wood for ${n * foodPerWood} food`)
      }
      if (choices.length > 1) {
        const selection = game.actions.choose(player, choices, {
          title: `${card.name}: Buy wood for food?`,
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          const match = selection[0].match(/Buy (\d+) wood for (\d+) food/)
          if (match) {
            const n = parseInt(match[1], 10)
            player.payCost({ food: n * foodPerWood })
            player.addResource('wood', n)
            game.log.add({
              template: '{player} buys {n} wood for {food} food via {card}',
              args: { player, n, food: n * foodPerWood, card },
            })
          }
        }
      }
    }
  },
}
