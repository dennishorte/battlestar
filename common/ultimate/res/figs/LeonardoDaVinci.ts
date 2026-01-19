export default {
  id: `Leonardo Da Vinci`,  // Card names are unique in Innovation
  name: `Leonardo Da Vinci`,
  color: `yellow`,
  age: 4,
  expansion: `figs`,
  biscuits: `p5hl`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would meld a card, first meld another card in your hand. If the other card is purple, draw three {4}, then score a top figure from anywhere.`,
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card, self }) => {
        const mayMeld = game
          .cards
          .byPlayer(player, 'hand')
          .filter(other => other.id !== card.id)

        const melded = game.actions.chooseAndMeld(player, mayMeld)[0]

        if (melded && melded.color === 'purple') {
          game.actions.draw(player, { age: game.getEffectAge(self, 4) })
          game.actions.draw(player, { age: game.getEffectAge(self, 4) })
          game.actions.draw(player, { age: game.getEffectAge(self, 4) })

          const topFigures = game
            .cards
            .topsAll()
            .filter(card => card.checkIsFigure())
          game.actions.chooseAndScore(player, topFigures)
        }
      }
    },
  ]
}
