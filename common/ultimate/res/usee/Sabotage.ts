import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Sabotage`,
  color: `yellow`,
  age: 6,
  expansion: `usee`,
  biscuits: `hfff`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you draw a {6}! Reveal the cards in your hand! Return the card of my choice from your hand! Tuck your top card and all cards from your score pile of the same color as the returned card!`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 6) })

      const cards = game.cards.byPlayer(player, 'hand')
      game.actions.revealMany(player, cards)

      const choices = cards.map(c => c.id)
      const card = game.actions.chooseCard(leader, choices)

      if (card) {
        const returned = game.actions.return(player, card)

        // Tuck top card of returned color
        const color = returned.color
        const topCard = game.cards.top(player, color)
        if (topCard) {
          game.actions.tuck(player, topCard)
        }

        // Tuck score pile cards of returned color
        const tuckScore = game
          .cards
          .byPlayer(player, 'score')
          .filter(c => c.color === color)
        game.actions.tuckMany(player, tuckScore)
      }
    },
  ],
} satisfies AgeCardData
