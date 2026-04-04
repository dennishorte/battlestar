module.exports = {
  id: "overachiever-e130",
  name: "Overachiever",
  deck: "occupationE",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "Each time you use a \"Wish for Children\" action space, you can play 1 additional minor improvement by paying its cost less 1 resource of your choice.",
  matches_onActionAnnounce(game, player, actionId) {
    if (actionId === 'family-growth-minor') {
      return 'silent'
    }
    return false
  },
  onActionAnnounce(game, player) {
    game.log.add({
      template: '{card}: {player} may play an additional improvement afterward',
      args: { player, card: this },
    })
  },
  matches_onAction(game, player, actionId) {
    return actionId === 'family-growth-minor' || actionId === 'family-growth-urgent'
  },
  onAction(game, player, _actionId) {
    const prev = player._anyResourceDiscount || 0
    player._anyResourceDiscount = prev + 1
    try {
      game.actions.buyMinorImprovement(player)
    }
    finally {
      player._anyResourceDiscount = prev
    }
  },
}
