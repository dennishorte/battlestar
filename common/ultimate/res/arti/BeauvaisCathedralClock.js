module.exports = {
  name: `Beauvais Cathedral Clock`,
  color: `green`,
  age: 3,
  expansion: `arti`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and reveal a {4}. Splay right the color matching the drawn card.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(self, 4))
      if (card) {
        game.aSplay(player, card.color, 'right')
      }
    }
  ],
}
