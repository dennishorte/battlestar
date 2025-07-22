module.exports = {
  name: `Probability`,
  color: `blue`,
  age: 5,
  expansion: `usee`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return all cards from your hand.`,
    `Draw and reveal two {6}, then return them. If exactly two different biscuit types appear on the drawn cards, draw and score two {6}. If exactly four different biscuit types appear, draw a {7}. Draw a {6}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cardsInHand = game.cards.byPlayer(player, 'hand')
      game.actions.returnMany(player, cardsInHand)
    },
    (game, player, { self }) => {
      const card1 = game.actions.drawAndReveal(player, game.getEffectAge(self, 6))
      const card2 = game.actions.drawAndReveal(player, game.getEffectAge(self, 6))

      game.actions.return(player, card1)
      game.actions.return(player, card2)

      const drawnBiscuits = game.utilCombineBiscuits(
        game.utilParseBiscuits(card1.biscuits),
        game.utilParseBiscuits(card2.biscuits),
      )

      const numberOfBiscuits = Object.values(drawnBiscuits).filter(x => x > 0).length

      game.log.add({ template: `The revealed cards had ${numberOfBiscuits} biscuit types total.` })

      if (numberOfBiscuits === 2) {
        game.aDrawAndScore(player, game.getEffectAge(self, 6))
        game.aDrawAndScore(player, game.getEffectAge(self, 6))
      }
      else if (numberOfBiscuits === 4) {
        game.aDraw(player, {age: game.getEffectAge(self, 7)})
      }

      game.aDraw(player, {age: game.getEffectAge(self, 6)})
    },
  ],
}
