module.exports = {
  id: "stallwright-e089",
  name: "Stallwright",
  deck: "occupationE",
  number: 89,
  type: "occupation",
  players: "1+",
  text: "After you play your 2nd, 3rd, 5th, and 7th occupation (including this one), you can build 1 stable at no cost.",
  onPlay(game, player) {
    this.checkStable(game, player)
  },
  onPlayOccupation(game, player) {
    this.checkStable(game, player)
  },
  checkStable(game, player) {
    const occCount = player.getOccupationCount()
    if ([2, 3, 5, 7].includes(occCount)) {
      game.actions.offerBuildFreeStable(player, this)
    }
  },
}
