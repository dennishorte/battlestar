module.exports = {
  id: "heresy-teacher-a113",
  name: "Heresy Teacher",
  deck: "occupationA",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "Each time you use a \"Lessons\" action space, you get 1 vegetable in each of your fields with at least 3 grain and no vegetable. Place the vegetable below the grain.",
  matches_onAction(game, player, actionId) {
    return actionId === 'occupation'
  },
  onAction(game, player, _actionId) {
    // Find fields with at least 3 grain and no vegetable underneath
    const eligibleFields = player.getFieldsWithGrainNoVegetable()

    for (const field of eligibleFields) {
      // Place the vegetable below the grain (will be harvested after all grain is gone)
      player.addVegetableToField(field.row, field.col)
    }

    if (eligibleFields.length > 0) {
      game.log.add({
        template: '{player} places {count} vegetable(s) below grain',
        args: { player, count: eligibleFields.length },
      })
    }
  },
}
