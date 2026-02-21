module.exports = {
  id: "lumber-virtuoso-d129",
  name: "Lumber Virtuoso",
  deck: "occupationD",
  number: 129,
  type: "occupation",
  players: "1+",
  text: "Each harvest in which you have at least 5 wood in your supply, you can discard down to 5 wood to take a \"Build Stables\" or \"Build Wood Rooms\" action by paying the usual costs.",
  onHarvest(game, player) {
    if (player.wood < 5) {
      return
    }
    const choices = ['Build stables (discard excess wood)', 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Lumber Virtuoso',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    // Discard wood down to 5
    const discarded = player.wood - 5
    if (discarded > 0) {
      player.setResource('wood', 5)
      game.log.add({
        template: '{player} discards {count} wood down to 5 ({card})',
        args: { player, count: discarded , card: this},
      })
    }
    // Offer to build stables (costs 2 wood each)
    game.actions.buildStable(player)
  },
}
