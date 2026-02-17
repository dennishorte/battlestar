module.exports = {
  id: "facades-carving-a036",
  name: "Facades Carving",
  deck: "minorA",
  number: 36,
  type: "minor",
  cost: { clay: 2, reed: 1 },
  prereqs: { woodGteRound: true },
  category: "Points Provider",
  text: "When you play this card, you can exchange any number of food for 1 bonus point each, up to the number of completed harvests.",
  onPlay(game, player) {
    const harvests = game.getCompletedHarvestCount()
    if (harvests > 0 && player.food >= 1) {
      const card = this
      const maxExchange = harvests
      const maxAffordable = Math.min(maxExchange, player.food)
      if (maxAffordable <= 0) {
        return
      }

      const selection = game.actions.choose(player, () => {
        const curMax = Math.min(maxExchange, player.food)
        const choices = []
        for (let i = 1; i <= curMax; i++) {
          choices.push(`Exchange ${i} food for ${i} bonus point${i > 1 ? 's' : ''}`)
        }
        choices.push('Skip')
        return choices
      }, {
        title: `${card.name}: Exchange food for bonus points?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        const match = selection[0].match(/Exchange (\d+) food/)
        if (match) {
          const amount = parseInt(match[1])
          player.payCost({ food: amount })
          player.addBonusPoints(amount)
          game.log.add({
            template: '{player} exchanges {amount} food for {amount} bonus points using {card}',
            args: { player, amount, card },
          })
        }
      }
    }
  },
}
