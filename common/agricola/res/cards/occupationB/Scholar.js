module.exports = {
  id: "scholar-b097",
  name: "Scholar",
  deck: "occupationB",
  number: 97,
  type: "occupation",
  players: "1+",
  text: "Once you live in a stone house, at the start of each round, you can play an occupation for an occupation cost of 1 food, or a minor improvement (by paying its cost).",
  onRoundStart(game, player) {
    if (player.roomType === 'stone') {
      const options = []
      if (player.hand.some(id => game.cards.byId(id) && game.cards.byId(id).type === 'occupation') && player.food >= 1) {
        options.push('Play an occupation (1 food)')
      }
      const minors = player.hand.filter(id => {
        const c = game.cards.byId(id)
        return c && c.type === 'minor' && player.canAffordCost(c.cost || {})
      })
      if (minors.length > 0) {
        options.push('Play a minor improvement')
      }
      if (options.length === 0) {
        return
      }
      options.push('Skip')
      const selection = game.actions.choose(player, options, {
        title: 'Scholar: Play a card?',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Skip') {
        return
      }
      if (selection[0].startsWith('Play an occupation')) {
        game.actions.playOccupation(player, { costOverride: 1 })
      }
      else {
        game.actions.buyMinorImprovement(player)
      }
    }
  },
}
