export default {
  name: `Philosopher's Stone`,
  color: `green`,
  age: 3,
  expansion: `arti`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Return a card from your hand. Score a number of cards from your hand equal to the value of the card returned. Junk all cards in the deck of value equal to the total value of the cards you score.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      if (cards.length > 0) {
        const card = cards[0]
        game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { count: card.getAge() })

        const totalValue = cards.reduce((acc, card) => acc + card.getAge(), 0)
        if (totalValue <= 11) {
          game.actions.junkDeck(player, totalValue)
        }
      }
    }
  ],
}
