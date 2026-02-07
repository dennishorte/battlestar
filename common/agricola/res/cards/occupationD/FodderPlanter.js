module.exports = {
  id: "fodder-planter-d115",
  name: "Fodder Planter",
  deck: "occupationD",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "In the breeding phase of each harvest, for each newborn animal you get, you can sow crops in exactly 1 field.",
  onBreedingPhase(game, player, newbornCount) {
    if (newbornCount > 0 && player.hasEmptyFields()) {
      game.actions.offerSowMultiple(player, this, newbornCount)
    }
  },
}
