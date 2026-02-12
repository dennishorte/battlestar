module.exports = {
  id: "writing-desk-d028",
  name: "Writing Desk",
  deck: "minorD",
  number: 28,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  category: "Actions Booster",
  text: "Each time you use a \"Lessons\" action space, you can play 1 additional occupation for an occupation cost of 2 food.",
  afterPlayerAction(game, player, actionId) {
    const lessonsActions = ['occupation', 'lessons-3', 'lessons-4', 'lessons-5', 'lessons-5b']
    if (lessonsActions.includes(actionId)) {
      const occsInHand = player.hand.filter(id => {
        const card = game.cards.byId(id)
        return card && card.type === 'occupation'
      })
      if (occsInHand.length > 0 && player.food >= 2) {
        const selection = game.actions.choose(player, [
          'Play 1 additional occupation for 2 food',
          'Skip',
        ], { title: 'Writing Desk', min: 1, max: 1 })
        if (selection[0] !== 'Skip') {
          game.actions.playOccupation(player, { costOverride: 2 })
        }
      }
    }
  },
}
