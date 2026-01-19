export default {
  name: `Placebo`,
  color: `blue`,
  age: 6,
  expansion: `usee`,
  biscuits: `ssfh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return a top card on your board, then you may repeat as many times as you want with the same color. Draw a {7} for each card you return. If you return exactly one {7}, draw an {8}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const firstCard = game.actions.chooseAndReturn(player, game.cards.tops(player))[0]

      if (!firstCard) {
        return
      }

      const returnedCards = [firstCard]
      const color = firstCard.color

      while (game.cards.top(player, color)) {
        const card = game.actions.chooseAndReturn(player, [game.cards.top(player, color)], { min: 0, max: 1 })[0]

        if (!card) {
          break
        }

        returnedCards.push(card)
      }

      returnedCards.forEach(() => {
        game.actions.draw(player, { age: game.getEffectAge(self, 7) })
      })

      const numSevensReturned = returnedCards
        .reduce((acc, c) => c.getAge() === 7 ? acc + 1 : acc, 0)

      if (numSevensReturned === 1) {
        game.log.add({
          template: '{player} returned exactly one card of value 7',
          args: { player }
        })
        game.actions.draw(player, { age: game.getEffectAge(self, 8) })
      }
    },
  ],
}
