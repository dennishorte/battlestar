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
      let bakingCount = 0
      for (const id of player.majorImprovements) {
        const imp = player.cards.byId(id)
        if (imp && imp.abilities && imp.abilities.canBake) {
          bakingCount++
        }
      }
      for (const id of player.playedMinorImprovements) {
        const card = player.cards.byId(id)
        if (card && card.definition.bakingConversion) {
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
