module.exports = {
  name: `Cipher`,
  color: `green`,
  age: 2,
  expansion: `usee`,
  biscuits: `hssk`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return all cards from your hand. If you return at least two, draw a card of value one higher than the highest value of card you return.`,
    `Draw a {2}. You may splay your blue cards left.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.aReturnMany(player, game.getCardsByZone(player, 'hand'))

      if (returned.length >= 2) {
        const highestValue = Math.max(...returned.map(card => card.getAge()))
        game.aDraw(player, { age: highestValue + 1 })
      }
    },
    (game, player, { self }) => {
      game.aDraw(player, { age: game.getEffectAge(self, 2) })
      game.aChooseAndSplay(player, ['blue'], 'left')
    }
  ],
}
