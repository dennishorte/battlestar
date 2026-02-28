module.exports = {
  id: "established-person-b088",
  name: "Established Person",
  deck: "occupationB",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "If your house has exactly 2 rooms, immediately renovate it without paying any building resources. If you do, you can immediately afterward take a \"Build Fences\" action.",
  onPlay(game, player) {
    if (!player || player.getRoomCount() !== 2) {
      return
    }

    const result = game.actions.freeRenovation(player, { card: this })
    if (result) {
      game.actions.buildFences(player)
    }
  },
}
