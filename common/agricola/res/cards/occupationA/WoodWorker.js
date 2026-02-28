module.exports = {
  id: "wood-worker-a164",
  name: "Wood Worker",
  deck: "occupationA",
  number: 164,
  type: "occupation",
  players: "4+",
  text: "Each time you take wood from an accumulation space, you can exchange 1 wood for 1 sheep. Place the wood on the accumulation space.",
  onAction(game, player, actionId) {
    if (!game.isWoodAccumulationSpace(actionId) || player.wood < 1 || !player.canPlaceAnimals('sheep', 1)) {
      return
    }
    const cardName = 'Wood Worker'
    const choice = game.actions.choose(player, ['Exchange 1 wood for 1 sheep', 'Skip'], {
      title: `${cardName}: Exchange 1 wood for 1 sheep (wood on space)?`,
      min: 1,
      max: 1,
    })
    if (choice[0] === 'Skip') {
      return
    }
    player.removeResource('wood', 1)
    game.actions.handleAnimalPlacement(player, { sheep: 1 })
    const state = game.state.actionSpaces[actionId]
    if (state && typeof state.accumulated === 'number') {
      state.accumulated = (state.accumulated || 0) + 1
    }
    game.log.add({
      template: '{player} exchanges 1 wood for 1 sheep using {card} (wood on space)',
      args: { player, card: cardName },
    })
  },
}
