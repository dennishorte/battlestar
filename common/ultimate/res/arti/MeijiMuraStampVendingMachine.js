module.exports = {
  name: `Meiji-Mura Stamp Vending Machine`,
  color: `green`,
  age: 8,
  expansion: `arti`,
  biscuits: `lchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Return a card from your hand. Draw and score three cards of the returned card's value. If you don't, junk all cards in the deck of value equal to the highest scored card.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      if (cards && cards.length > 0) {
        const age = cards[0].getAge()

        const scored = [
          game.actions.drawAndScore(player, age),
          game.actions.drawAndScore(player, age),
          game.actions.drawAndScore(player, age),
        ]

        const scoredAges = scored.map(card => card.getAge()).sort((l, r) => r - l)
        const scoredAgesMatchAge = scoredAges.every(other => other === age)
        if (!scoredAgesMatchAge) {
          const highestAge = scoredAges[0]
          game.actions.junkDeck(player, highestAge)
        }
      }
    }
  ],
}
