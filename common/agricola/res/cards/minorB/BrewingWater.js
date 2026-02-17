module.exports = {
  id: "brewing-water-b060",
  name: "Brewing Water",
  deck: "minorB",
  number: 60,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "Each time you use the \"Fishing\" accumulation space, you can pay 1 grain to place 1 food on each of the next 6 round spaces. At the start of these rounds, you get the food.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing' && player.grain >= 1) {
      const card = this
      const choices = ['Accept', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Pay 1 grain to schedule 1 food on next 6 rounds?`,
        min: 1,
        max: 1,
      })

      if (selection[0] === 'Accept') {
        player.payCost({ grain: 1 })
        const currentRound = game.state.round
        let scheduled = 0
        for (let i = 1; i <= 6; i++) {
          const targetRound = currentRound + i
          if (game.scheduleResource(player, 'food', targetRound, 1)) {
            scheduled++
          }
        }
        game.log.add({
          template: '{player} pays 1 grain via {card}, scheduling 1 food on {count} rounds',
          args: { player, card, count: scheduled },
        })
      }
    }
  },
}
