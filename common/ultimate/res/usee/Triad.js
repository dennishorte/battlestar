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
      if (hand.cardlist().length >= 3) {
        const returned = game.actions.chooseAndReturn(player, hand.cardlist())[0]
        game.actions.splay(player, returned.color, 'right')
        game.actions.chooseAndTuck(player, hand.cardlist())
        game.actions.chooseAndScore(player, hand.cardlist())
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
