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
      const returned = game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))

      if (returned.length >= 2) {
        const highestValue = Math.max(...returned.map(card => card.getAge()))
        game.actions.draw(player, { age: highestValue + 1 })
      }
    },
    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 2) })
      game.actions.chooseAndSplay(player, ['blue'], 'left')
    }
  ],
}
