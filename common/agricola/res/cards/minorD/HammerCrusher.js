module.exports = {
  id: "hammer-crusher-d014",
  name: "Hammer Crusher",
  deck: "minorD",
  number: 14,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Immediately before you renovate to stone, you get 2 clay and 1 reed and you can take a \"Build Rooms\" action.",
  onBeforeRenovateToStone(game, player) {
    player.addResource('clay', 2)
    player.addResource('reed', 1)
    game.log.add({
      template: '{player} gets 2 clay and 1 reed from Hammer Crusher',
      args: { player },
    })
    game.actions.offerBuildRooms(player, this)
  },
}
