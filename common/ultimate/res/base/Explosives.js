module.exports = {
  name: `Explosives`,
  color: `red`,
  age: 7,
  expansion: `base`,
  biscuits: `hfff`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer the three highest cards from your hand to my hand! If you transferred any, and then have no cards in hand, draw a {7}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const target = game.getZoneByPlayer(leader, 'hand')
      const cards = game.getCardsByZone(player, 'hand')

      const toTransfer = game.aChooseHighest(player, cards, 3)
      const transferred = game.aTransferMany(player, toTransfer, target)

      const transferredCondition = transferred.length > 0
      const emptyHandCondition = game.getCardsByZone(player, 'hand').length === 0
      if (transferredCondition && emptyHandCondition) {
        game.aDraw(player, { age: game.getEffectAge(self, 7) })
      }
    }
  ],
}
