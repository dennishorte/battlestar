module.exports = {
  id: "teachers-desk-c028",
  name: "Teacher's Desk",
  deck: "minorC",
  number: 28,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 1 },
  category: "Actions Booster",
  text: "Each time you use the \"Major Improvement\" or \"House Redevelopment\" action space, you can also play 1 occupation at an occupation cost of 1 food.",
  onAction(game, player, actionId) {
    if (actionId === 'major-minor-improvement' || actionId === 'renovation-improvement') {
      const occsInHand = player.hand.filter(id => {
        const card = game.cards.byId(id)
        return card && card.type === 'occupation'
      })
      if (occsInHand.length > 0 && player.food >= 1) {
        const selection = game.actions.choose(player, [
          'Play 1 occupation for 1 food',
          'Skip',
        ], { title: "Teacher's Desk", min: 1, max: 1 })
        if (selection[0] !== 'Skip') {
          game.actions.playOccupation(player, { costOverride: 1 })
        }
      }
    }
  },
}
