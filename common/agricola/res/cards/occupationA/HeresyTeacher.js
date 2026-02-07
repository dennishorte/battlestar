module.exports = {
  id: "heresy-teacher-a113",
  name: "Heresy Teacher",
  deck: "occupationA",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "Each time you use a \"Lessons\" action space, you get 1 vegetable in each of your fields with at least 3 grain and no vegetable. Place the vegetable below the grain.",
  onAction(game, player, actionId) {
    if (actionId === 'lessons-1' || actionId === 'lessons-2') {
      const eligibleFields = player.getFieldsWithGrainNoVegetable(3)
      for (const field of eligibleFields) {
        player.addVegetableToField(field)
      }
      if (eligibleFields.length > 0) {
        game.log.add({
          template: '{player} places vegetables in {count} fields from Heresy Teacher',
          args: { player, count: eligibleFields.length },
        })
      }
    }
  },
}
