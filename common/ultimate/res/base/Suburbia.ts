export default {
  name: `Suburbia`,
  color: `yellow`,
  age: 9,
  expansion: `base`,
  biscuits: `hcll`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may tuck any number of cards from your hand. Draw and score a {1} for each card you tucked.`,
    `You may junk all cards in the {9} deck.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = game.cards.byPlayer(player, 'hand')
      const tucked = game.actions.chooseAndTuck(player, cards, { min: 0, max: cards.length })
      if (tucked) {
        for (let i = 0; i < tucked.length; i++) {
          game.actions.drawAndScore(player, game.getEffectAge(self, 1))
        }
      }
    },

    (game, player) => {
      game.actions.junkDeck(player, 9, { optional: true })
    },
  ],
}
