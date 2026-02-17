module.exports = {
  id: "freshman-a097",
  name: "Freshman",
  deck: "occupationA",
  number: 97,
  type: "occupation",
  players: "1+",
  text: "Each time you get a \"Bake Bread\" action, instead of taking the action, you can play an occupation without paying an occupation cost.",
  onBakeBreadAction(game, player) {
    const occupationsInHand = player.hand.filter(cardId => {
      const c = game.cards.byId(cardId)
      return c && c.type === 'occupation' && player.meetsCardPrereqs(cardId)
    })
    if (occupationsInHand.length === 0) {
      return false
    }

    const choices = ['Play an occupation free', 'Bake bread normally']
    const selection = game.actions.choose(player, choices, {
      title: 'Freshman: Play occupation instead of baking?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Play an occupation free') {
      game.actions.playOccupation(player, { free: true })
      return true
    }
    return false
  },
}
