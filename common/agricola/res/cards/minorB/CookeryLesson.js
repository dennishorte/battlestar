module.exports = {
  id: "cookery-lesson-b029",
  name: "Cookery Lesson",
  deck: "minorB",
  number: 29,
  type: "minor",
  cost: { food: 2 },
  category: "Points Provider",
  text: "Each time you use a \"Lessons\" action space and a Cooking improvement on the same turn, you get 1 bonus point.",
  onLessonsWithCooking(game, player) {
    player.bonusPoints = (player.bonusPoints || 0) + 1
    game.log.add({
      template: '{player} gets 1 bonus point from Cookery Lesson',
      args: { player },
    })
  },
}
