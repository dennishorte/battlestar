module.exports = {
  id: "hedge-keeper-a088",
  name: "Hedge Keeper",
  deck: "occupationA",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "Each time you take a \"Build Fences\" action, you do not have to pay wood for 3 of the fences you build.",
  onStartFenceAction(game, player) {
    player._hedgeKeeperFreeFences = 3
  },
  onEndFenceAction(game, player) {
    delete player._hedgeKeeperFreeFences
  },
  modifyFenceCost(player, fenceCount) {
    const freeFences = player._hedgeKeeperFreeFences || 0
    return Math.max(0, fenceCount - freeFences)
  },
  consumeFenceCost(player, fenceCount) {
    if ((player._hedgeKeeperFreeFences || 0) > 0) {
      const used = Math.min(fenceCount, player._hedgeKeeperFreeFences)
      player._hedgeKeeperFreeFences -= used
    }
  },
}
