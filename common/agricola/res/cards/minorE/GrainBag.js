module.exports = {
  id: "grain-bag-e067",
  name: "Grain Bag",
  deck: "minorE",
  number: 67,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  text: "Each time you use the \"Grain Seeds\" action space, you get 1 additional grain for each baking improvement you have.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain') {
      const allIds = [...player.majorImprovements, ...player.playedMinorImprovements]
      let bakingCount = 0
      for (const id of allIds) {
        const card = player.cards.byId(id)
        if (card && card.bakingConversion) {
          bakingCount++
        }
      }
      if (bakingCount > 0) {
        player.addResource('grain', bakingCount)
        game.log.add({
          template: '{player} gets {amount} bonus grain from {card}',
          args: { player, amount: bakingCount, card: this },
        })
      }
    }
  },
}
