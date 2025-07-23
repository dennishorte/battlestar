module.exports = {
  name: `Steam Engine`,
  color: `yellow`,
  age: 5,
  expansion: `base`,
  biscuits: `hfcf`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw and tuck two {4}, then score your bottom yellow card. If it is Steam Engine, junk all cards in the {6} deck.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndTuck(player, game.getEffectAge(self, 4))
      game.actions.drawAndTuck(player, game.getEffectAge(self, 4))

      const cards = game.cards.byPlayer(player, 'yellow')
      const card = cards[cards.length - 1]
      game.actions.score(player, card)

      if (card.name === 'Steam Engine') {
        game.aJunkDeck(player, 6)
      }
    }
  ],
}
