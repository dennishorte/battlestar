module.exports = {
  name: `Triad`,
  color: `purple`,
  age: 6,
  expansion: `usee`,
  biscuits: `slhs`,
  dogmaBiscuit: `s`,
  dogma: [
    `If you have at least three cards in your hand, return a card from your hand and splay the color of the returned card right, tuck a card from your hand, and score a card from your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.zones.byPlayer(player, 'hand')
      if (hand.cards().length >= 3) {
        const returned = game.aChooseAndReturn(player, hand.cards())[0]
        game.aSplay(player, returned.color, 'right')
        game.actions.chooseAndTuck(player, hand.cards())
        game.aChooseAndScore(player, hand.cards())
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
