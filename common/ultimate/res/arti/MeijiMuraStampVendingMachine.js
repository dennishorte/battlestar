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

        const drawnAges = []
        for (let i = 0; i < 3; i++) {
          const drawn = game.actions.draw(player, { age })
          if (drawn) {
            drawnAges.push(drawn.getAge())
            game.actions.score(player, drawn)
          }
        }

        if (drawnAges.length > 0) {
          const sortedAges = [...drawnAges].sort((l, r) => r - l)
          const scoredAgesMatchAge = drawnAges.every(other => other === age)
          if (!scoredAgesMatchAge) {
            game.actions.junkDeck(player, sortedAges[0])
          }
        }
      }
    }
  ],
}
