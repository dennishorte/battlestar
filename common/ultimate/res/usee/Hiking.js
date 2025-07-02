module.exports = {
  name: `Hiking`,
  color: `green`,
  age: 6,
  expansion: `usee`,
  biscuits: `llhs`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and reveal a {6}. If the top card on your board of the drawn card's color has {f}, tuck the drawn card and draw and reveal a {7}. If the second drawn card has {l}, meld it and draw an {8}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const firstCard = game.aDrawAndReveal(player, game.getEffectAge(self, 6))

      if (firstCard) {
        const topCard = game.getTopCard(player, firstCard.color)

        if (topCard && topCard.checkHasBiscuit('f')) {
          game.aTuck(player, firstCard)

          const secondCard = game.aDrawAndReveal(player, game.getEffectAge(self, 7))

          if (secondCard && secondCard.checkHasBiscuit('l')) {
            game.aMeld(player, secondCard)
            game.aDraw(player, { age: game.getEffectAge(self, 8) })
          }
        }
      }
    },
  ],
}
