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
      const target = game.zones.byPlayer(leader, 'hand')
      const cards = game.cards.byPlayer(player, 'hand')

      const toTransfer = game.aChooseHighest(player, cards, 3)
      const transferred = game.actions.transferMany(player, toTransfer, target)

      const transferredCondition = transferred.length > 0
      const emptyHandCondition = game.cards.byPlayer(player, 'hand').length === 0
      if (transferredCondition && emptyHandCondition) {
        game.actions.draw(player, { age: game.getEffectAge(self, 7) })
      }
    }
  ],
}
