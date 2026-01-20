module.exports = {
  name: `First Aid`,
  color: `blue`,
  age: 0,
  expansion: `base`,
  biscuits: `slhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `Return a top card from your board. Draw a {z}. Reveal your hand. If you have exactly one card in your hand of the color of the returned card, meld it. Otherwise, you lose.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const returnChoices = game.cards.tops(player)
      const returnedCard = game.actions.chooseAndReturn(player, returnChoices)[0]

      game.actions.draw(player, { age: game.getEffectAge(self, 0) })

      const handCards = game.cards.byPlayer(player, 'hand')
      game.actions.revealMany(player, handCards, { ordered: true })

      if (returnedCard) {
        const colorMatchedHandCards = handCards.filter(card => card.color === returnedCard.color)
        if (colorMatchedHandCards.length === 1) {
          game.actions.meld(player, colorMatchedHandCards[0])
        }
        else {
          game.youLose(player, self.name)
        }
      }
    }
  ],
}
