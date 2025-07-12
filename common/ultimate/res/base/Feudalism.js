module.exports = {
  name: `Feudalism`,
  color: `purple`,
  age: 3,
  expansion: `base`,
  biscuits: `hklk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer a card with a {k} from your hand to my hand! If you do, unsplay that color of your cards!`,
    `You may splay your yellow or purple cards left.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      const cards = game.aChooseAndTransfer(player, choices, game.zones.byPlayer(leader, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        game.aUnsplay(player, card.color)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'purple'], 'left')
    }
  ],
}
