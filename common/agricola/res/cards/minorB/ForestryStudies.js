module.exports = {
  id: "forestry-studies-b028",
  name: "Forestry Studies",
  deck: "minorB",
  number: 28,
  type: "minor",
  cost: { food: 2 },
  category: "Actions Booster",
  text: "Each time after you use the \"Forest\" accumulation space, you can return 2 wood to that space to play 1 occupation without paying an occupation cost.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' && player.wood >= 2) {
      const card = this
      const occupationsInHand = player.hand.filter(cardId => {
        const c = game.cards.byId(cardId)
        return c && c.type === 'occupation' && player.meetsCardPrereqs(cardId)
      })
      if (occupationsInHand.length === 0) {
        return
      }

      const choices = [
        'Return 2 wood to play 1 occupation free',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Return 2 wood to play 1 occupation free?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 2 })
        const actionSpace = game.state.actionSpaces['take-wood']
        if (actionSpace) {
          actionSpace.accumulated += 2
        }
        game.actions.playOccupation(player, { free: true })
      }
    }
  },
}
