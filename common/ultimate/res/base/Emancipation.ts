export default {
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
      const cards = game.actions.chooseAndTransfer(
        player,
        game.cards.byPlayer(player, 'hand'),
        game.zones.byPlayer(leader, 'score')
      )
      if (cards && cards.length > 0) {
        game.actions.draw(player, { age: game.getEffectAge(self, 6) })
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['red', 'purple'], 'right')
    },
  ],
}
