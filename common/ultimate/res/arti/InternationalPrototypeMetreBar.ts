export default {
  name: `International Prototype Metre Bar`,
  color: `green`,
  age: 7,
  expansion: `arti`,
  biscuits: `chcf`,
  dogmaBiscuit: `c`,
  dogma: [
    `Choose a value. Draw and reveal three cards of that value. Splay up the color of the cards. If the number of cards of each of those colors on your board is equal to that value, you win. Otherwise, return the drawn cards.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const age = game.actions.chooseAge(player)
      const cards = [
        game.actions.drawAndReveal(player, age),
        game.actions.drawAndReveal(player, age),
        game.actions.drawAndReveal(player, age),
      ]

      for (const card of cards) {
        game.actions.splay(player, card.color, 'up')
      }

      const numbersOfCards = cards.map(card => ({
        color: card.color,
        count: game.cards.byPlayer(player, card.color).length
      }))

      const numbersString = numbersOfCards.map(({ color, count }) => `${color}: ${count}`).join(', ')
      game.log.add({ template: numbersString })

      if (numbersOfCards.every(({ count }) => count === age)) {
        game.youWin(player, self.name)
      }
      else {
        game.actions.returnMany(player, cards)
      }
    }
  ],
}
