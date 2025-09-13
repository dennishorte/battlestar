module.exports = {
  name: `Watermill`,
  color: `yellow`,
  age: 2,
  expansion: `echo`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  echo: ``,
  dogma: [
    `Tuck a card of value equal to a bonus on your board, if you have one.`,
    `Tuck a card from your hand. If Watermill was foreseen, tuck all cards from the deck of value equal to the tucked card.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const bonuses = game.getBonuses(player)
      const choices = game
        .cards
        .byPlayer(player, 'hand')
        .filter(card => bonuses.includes(card.getAge()))
      game.actions.chooseAndTuck(player, choices)
    },

    (game, player, { foreseen, self }) => {
      const tucked = game.actions.chooseAndTuck(player, game.cards.byPlayer(player, 'hand'))[0]

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        const cards = game.cards.byDeck('base', tucked.getAge())

        // The player can't look at the cards in the deck in advance, so they can't really pick an order.
        game.actions.tuckMany(player, cards, { ordered: true })
      }
    },
  ],
  echoImpl: [],
}
