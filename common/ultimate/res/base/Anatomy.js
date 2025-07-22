module.exports = {
  name: `Anatomy`,
  color: `yellow`,
  age: 4,
  expansion: `base`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you return a card from your score pile! If you do, return a top card of equal value from your board!`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.zones.byPlayer(player, 'score').cards())
      if (cards.length > 0) {
        const returned = cards[0]
        const matchingTopCards = game
          .getTopCards(player)
          .filter(card => card.getAge() === returned.getAge())
        game.actions.chooseAndReturn(player, matchingTopCards)
      }
    }
  ],
}
