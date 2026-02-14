module.exports = {
  id: "heresy-teacher-a113",
  name: "Heresy Teacher",
  deck: "occupationA",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "Each time you use a \"Lessons\" action space, you get 1 vegetable in each of your fields with at least 3 grain and no vegetable. Place the vegetable below the grain.",
  onAction(game, player, actionId) {
    if (actionId === 'occupation') {
      // Find fields with at least 3 grain and no vegetables
      const eligibleFields = player.getFieldSpaces().filter(f =>
        f.crop === 'grain' && f.cropCount >= 3
      )
      for (const _field of eligibleFields) {
        // Add 1 vegetable to player's supply for each eligible field
        // (The card text "Place the vegetable below the grain" is flavor text)
        player.addResource('vegetables', 1)
      }
      if (eligibleFields.length > 0) {
        game.log.add({
          template: '{player} gets {count} vegetable(s) from Heresy Teacher',
          args: { player, count: eligibleFields.length },
        })
      }
    }
  },
}
