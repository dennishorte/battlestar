module.exports = {
  id: "overachiever-e130",
  name: "Overachiever",
  deck: "occupationE",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "Each time you use a \"Wish for Children\" action space, you can play 1 additional improvement by paying its cost less 1 resource of your choice.",
  matches_onAction(game, player, actionId) {
    return actionId === 'family-growth' || actionId === 'family-growth-urgent'
  },
  onAction(game, player, _actionId) {
    const selection = game.actions.choose(player, ['Build improvement (discounted)', 'Skip'], {
      title: 'Overachiever: Build improvement at -1 resource?',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      const prev = player._anyResourceDiscount || 0
      player._anyResourceDiscount = prev + 1
      try {
        game.actions.buildImprovement(player)
      }
      finally {
        player._anyResourceDiscount = prev
      }
    }
  },
}
