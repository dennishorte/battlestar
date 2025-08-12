module.exports = {
  name: `Glassblowing`,
  color: `green`,
  age: 2,
  expansion: `echo`,
  biscuits: `hcc&`,
  dogmaBiscuit: `c`,
  echo: [`Score an expansion card from your hand.`],
  dogma: [
    `Draw and foreshadow a card of value three higher than the lowest non-green top card on your board.`,
    `Choose the {2} or {3} deck. Junk all cards in that deck.`
  ],
  dogmaImpl: [
    (game, player) => {
      const topCards = game
        .cards.tops(player)
        .filter(card => card.color !== 'green')
      const lowest = game.util.lowestCards(topCards)

      if (lowest.length === 0) {
        game.actions.drawAndForeshadow(player, 3)
      }
      else {
        game.actions.drawAndForeshadow(player, lowest[0].getAge() + 3)
      }
    },

    (game, player) => {
      game.actions.chooseAndJunkDeck(player, [game.getEffectAge(this, 2), game.getEffectAge(this, 3)])
    },
  ],
  echoImpl: [
    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkIsExpansion())
      game.actions.chooseAndScore(player, choices)
    }
  ],
}
