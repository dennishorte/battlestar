module.exports = {
  name: `Abell Gallery Harpsichord`,
  color: `purple`,
  age: 4,
  expansion: `arti`,
  biscuits: `lhcl`,
  dogmaBiscuit: `l`,
  dogma: [
    `For each value of top card on your board appearing exactly once, draw and score a card of that value in ascending order.`
  ],
  dogmaImpl: [
    (game, player) => {
      const topCards = game.getTopCards(player)

      for (let i = 1; i <= 10; i++) {
        const matching = topCards.filter(card => card.getAge() === i).length
        if (matching === 1) {
          game.actions.drawAndScore(player, i)
        }
      }
    }
  ],
}
