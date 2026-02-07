module.exports = {
  id: "animal-catcher-c168",
  name: "Animal Catcher",
  deck: "occupationC",
  number: 168,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Day Laborer\" action space, instead of 2 food, you can get 3 different animals from the general supply. If you do, you must pay 1 food each harvest left to play.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      game.actions.offerAnimalCatcherChoice(player, this)
    }
  },
}
