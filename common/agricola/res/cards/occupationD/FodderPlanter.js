module.exports = {
  id: "fodder-planter-d115",
  name: "Fodder Planter",
  deck: "occupationD",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "In the breeding phase of each harvest, for each newborn animal you get, you can sow crops in exactly 1 field.",
  onBreedingPhaseEnd(game, player, newbornCount) {
    if (newbornCount > 0 && player.getEmptyFields().length > 0) {
      game.log.add({
        template: '{player} can sow {count} field(s) from Fodder Planter',
        args: { player, count: newbornCount },
      })
      for (let i = 0; i < newbornCount; i++) {
        if (player.getEmptyFields().length === 0) {
          break
        }
        if (player.grain < 1 && player.vegetables < 1) {
          break
        }
        game.actions.sow(player)
      }
    }
  },
}
