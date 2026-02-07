module.exports = {
  id: "established-person-b088",
  name: "Established Person",
  deck: "occupationB",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "If your house has exactly 2 rooms, immediately renovate it without paying any building resources. If you do, you can immediately afterward take a \"Build Fences\" action.",
  onPlay(game, player) {
    if (player.getRoomCount() === 2 && player.canRenovate()) {
      game.actions.freeRenovation(player, this)
      game.actions.offerBuildFences(player, this)
    }
  },
}
