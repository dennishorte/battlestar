module.exports = {
  name: `Philosopher's Stone`,
  color: `green`,
  age: 3,
  expansion: `arti`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Return a card from your hand. Score a number of cards from your hand equal to the value of the card returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { count: card.getAge() })
      }
    }
  ],
}
