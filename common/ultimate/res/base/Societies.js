module.exports = {
  name: `Societies`,
  color: `purple`,
  age: 5,
  expansion: `base`,
  biscuits: `chsc`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a card with a {s} higher than my top card of the same color from your board to my board! If you do, draw a {5}!`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit('s'))
        .filter(card => {
          const leaderCard = game.getTopCard(leader, card.color)
          if (!leaderCard) {
            return true
          }
          else {
            return leaderCard.getAge() < card.getAge()
          }
        })
      const cards = game.actions.chooseAndTransfer(player, choices, { toBoard: true, player: leader })
      if (cards && cards.length > 0) {
        game.actions.draw(player, { age: game.getEffectAge(self, 5) })
      }
    }
  ],
}
