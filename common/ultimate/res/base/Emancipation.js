module.exports = {
  name: `Emancipation`,
  color: `purple`,
  age: 6,
  expansion: `base`,
  biscuits: `fsfh`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer a card from your hand to my score pile! If you do, draw a {6}.`,
    `You may splay your red or purple cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const cards = game.aChooseAndTransfer(
        player,
        game.getCardsByZone(player, 'hand'),
        game.zones.byPlayer(leader, 'score')
      )
      if (cards && cards.length > 0) {
        game.aDraw(player, { age: game.getEffectAge(self, 6) })
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'purple'], 'right')
    },
  ],
}
