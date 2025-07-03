module.exports = {
  name: `Physics`,
  color: `blue`,
  age: 5,
  expansion: `base`,
  biscuits: `fssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw three {6} and reveal them. If two or more of the drawn cards are the same color, return all cards in your hand.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card1 = game.aDrawAndReveal(player, game.getEffectAge(self, 6))
      const card2 = game.aDrawAndReveal(player, game.getEffectAge(self, 6))
      const card3 = game.aDrawAndReveal(player, game.getEffectAge(self, 6))

      if (card1.color === card2.color || card2.color === card3.color || card3.color === card1.color) {
        game.log.add({
          template: 'Two or more of the cards had the same color'
        })
        game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      }
    }
  ],
}
