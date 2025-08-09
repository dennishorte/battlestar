module.exports = {
  name: `Counterintelligence`,
  color: `blue`,
  age: 7,
  expansion: `usee`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `I demand you tuck a top card on your board with {s}! If you do, transfer your top card of color matching the tucked card to my board, and draw a {7}!`,
    `Draw an {8}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit('s'))

      const tuckedCard = game.actions.chooseAndTuck(player, choices)[0]

      if (tuckedCard) {
        const matchingCard = game.getTopCard(player, tuckedCard.color)

        if (matchingCard) {
          game.actions.transfer(player, matchingCard, game.zones.byPlayer(leader, matchingCard.color))
          game.actions.draw(player, { age: game.getEffectAge(self, 7) })
        }
      }
    },
    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 8) })
    }
  ],
}
