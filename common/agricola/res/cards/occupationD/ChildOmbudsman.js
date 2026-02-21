module.exports = {
  id: "child-ombudsman-d092",
  name: "Child Ombudsman",
  deck: "occupationD",
  number: 92,
  type: "occupation",
  players: "1+",
  text: "From round 5 on, if you have room in your house, at the end of each person action, you can take a \"Family Growth\" action with that person. If you do, you get 2 negative points.",
  onPersonActionEnd(game, player) {
    if (game.state.round < 5) {
      return
    }
    if (!player.canGrowFamily()) {
      return
    }
    const choices = ['Grow family (2 begging cards)', 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Child Ombudsman',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      player.growFamily()
      player.addResource('beggingCards', 2)
      game.log.add({
        template: '{player} grows family via {card} (2 begging cards)',
        args: { player , card: this},
      })
    }
  },
}
