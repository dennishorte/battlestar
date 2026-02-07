module.exports = {
  id: "throwing-axe-a052",
  name: "Throwing Axe",
  deck: "minorA",
  number: 52,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { minRound: 7 },
  category: "Food Provider",
  text: "Each time you use a wood accumulation space while there is at least 1 wild boar on the \"Pig Market\" accumulation space, you also get 2 food.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
      const pigMarket = game.state.actionSpaces['take-boar']
      if (pigMarket && pigMarket.accumulated >= 1) {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Throwing Axe',
          args: { player },
        })
      }
    }
  },
}
