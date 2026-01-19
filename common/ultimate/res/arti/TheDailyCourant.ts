export default {
  name: `The Daily Courant`,
  color: `yellow`,
  age: 5,
  expansion: `arti`,
  biscuits: `ffch`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw, reveal, and return a {6}. Draw and meld a card of value equal to the value of your top card of the same color as the returned card. Self-execute the melded card.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      // Draw, reveal, return
      const firstCard = game.actions.drawAndReveal(player, 6)
      game.actions.return(player, firstCard)

      // Draw and meld
      const topCard = game.cards.top(player, firstCard.color)
      const age = topCard ? topCard.getAge() : 1
      const meldCard = game.actions.drawAndMeld(player, age)

      // Self execute
      game.aSelfExecute(self, player, meldCard)
    }
  ],
}
