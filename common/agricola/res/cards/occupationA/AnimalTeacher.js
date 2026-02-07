module.exports = {
  id: "animal-teacher-a168",
  name: "Animal Teacher",
  deck: "occupationA",
  number: 168,
  type: "occupation",
  players: "4+",
  text: "Immediately after each time you use a \"Lessons\" action space, you can also buy 1 sheep/wild boar/cattle for 0/1/2 food.",
  onAction(game, player, actionId) {
    if (actionId === 'lessons-1' || actionId === 'lessons-2') {
      game.actions.offerBuyAnimalTeacher(player, this)
    }
  },
}
