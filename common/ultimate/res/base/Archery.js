module.exports = {
  name: `Archery`,
  color: `red`,
  age: 1,
  expansion: `base`,
  biscuits: `kshk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you draw a {1}, then transfer the highest card in your hand to my hand!`,
    `Junk an available achievement of value 1 or 2.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      game.aDraw(player, { age: game.getEffectAge(self, 1) })
      const highest = game.aChooseHighest(player, game.getCardsByZone(player, 'hand'), 1)
      if (highest.length > 0) {
        game.aTransfer(player, highest[0], game.getZoneByPlayer(leader, 'hand'))
      }
    },
    (game, player) => {
      game.aJunkAvailableAchievement(player, [1, 2])
    }
  ],
}
