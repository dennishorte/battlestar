module.exports = {
  name: `Seikan Tunnel`,
  color: `green`,
  age: 10,
  expansion: `arti`,
  biscuits: `iiih`,
  dogmaBiscuit: `i`,
  dogma: [
    `If you have the most cards of a color visible on your board out of all colors on all boards, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const playersStackCounts = game
        .zones
        .colorStacks(player)
        .map(zone => zone.numVisibleCards())

      const playersLargestStack = playersStackCounts
        .sort((l, r) => r - l)
        .slice(0)[0]

      const otherPlayersStackCounts = game
        .players
        .other(player)
        .flatMap(other => game
          .zones
          .colorStacks(other)
          .map(zone => zone.numVisibleCards())
        )

      const otherPlayersLargestStack = otherPlayersStackCounts
        .sort((l, r) => r - l)
        .slice(0)[0]


      if (playersLargestStack > otherPlayersLargestStack) {
        game.youWin(player, self.name)
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
