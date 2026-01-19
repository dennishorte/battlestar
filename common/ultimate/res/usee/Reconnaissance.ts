export default {
  name: `Reconnaissance`,
  color: `blue`,
  age: 6,
  expansion: `usee`,
  biscuits: `fhfs`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you reveal your hand!`,
    `Draw and reveal three {6}. Return two of the drawn cards. You may splay the color of the card not returned right.`
  ],
  dogmaImpl: [
    (game, player) => {
      const playerHand = game.cards.byPlayer(player, 'hand')
      game.actions.revealMany(player, playerHand)
    },
    (game, player, { self }) => {
      const drawnCards = []
      for (let i = 0; i < 3; i++) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 6))
        drawnCards.push(card)
      }

      const cardsToReturn = game.actions.chooseAndReturn(player, drawnCards, { count: 2 })
      const keptCard = drawnCards.find(c => !cardsToReturn.includes(c))

      if (keptCard) {
        game.actions.chooseAndSplay(player, [keptCard.color], 'right')
      }
    },
  ],
}
