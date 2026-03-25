module.exports = {
  id: "grain-bag-e067",
  name: "Grain Bag",
  deck: "minorE",
  number: 67,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  text: "Each time you use the \"Grain Seeds\" action space, you get 1 additional grain for each baking improvement you have.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain'
  },
  onAction(game, player, _actionId) {
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
        template: '{player} gets {amount} bonus grain',
        args: { player, amount: bakingCount },
      })
    }
  },
}
