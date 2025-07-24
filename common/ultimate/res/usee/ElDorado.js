module.exports = {
  name: `El Dorado`,
  color: `green`,
  age: 4,
  expansion: `usee`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and meld a {3}, a {2}, and a {1}. If all three cards have {c}, score all cards in the {5} deck. If at least two have {c}, splay your green and blue cards right.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      // Draw and meld the three cards
      const card3 = game.actions.drawAndMeld(player, game.getEffectAge(self, 3))
      const card2 = game.actions.drawAndMeld(player, game.getEffectAge(self, 2))
      const card1 = game.actions.drawAndMeld(player, game.getEffectAge(self, 1))

      const crownCount = [card3, card2, card1].filter(card => card.checkHasBiscuit('c')).length

      if (crownCount === 3) {
        game.actions.scoreMany(player, game.getZoneByDeck('base', 5).cards(), { ordered: true })
      }

      if (crownCount >= 2) {
        game.actions.splay(player, 'green', 'right')
        game.actions.splay(player, 'blue', 'right')
      }
    },
  ],
}
