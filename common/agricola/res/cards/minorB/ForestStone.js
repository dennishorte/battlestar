module.exports = {
  id: "forest-stone-b048",
  name: "Forest Stone",
  deck: "minorB",
  number: 48,
  type: "minor",
  cost: { wood: 2 },
  costAlternative: { stone: 1 },
  vps: 1,
  prereqs: { occupations: 1 },
  category: "Food Provider",
  text: "Place 2 food on this card. Each time you use a wood accumulation space, move 1 of these food to your supply. Each time you use a stone accumulation space, add 2 food to this card.",
  onPlay(game, player) {
    player.forestStoneFood = 2
    game.log.add({
      template: '{player} places 2 food on {card}',
      args: { player , card: this},
    })
  },
  onAction(game, player, actionId) {
    if (game.isWoodAccumulationSpace(actionId)) {
      if (player.forestStoneFood > 0) {
        player.forestStoneFood--
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from {card} ({remaining} remaining)',
          args: { player, remaining: player.forestStoneFood , card: this},
        })
      }
    }
    else if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
      player.forestStoneFood = (player.forestStoneFood || 0) + 2
      game.log.add({
        template: '{player} adds 2 food to {card} ({total} total)',
        args: { player, total: player.forestStoneFood , card: this},
      })
    }
  },
}
