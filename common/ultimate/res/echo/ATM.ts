export default {
  name: `ATM`,
  color: `yellow`,
  age: 9,
  expansion: `echo`,
  biscuits: `ch&9`,
  dogmaBiscuit: `c`,
  echo: `Draw and score a card of any value.`,
  dogma: [
    `I demand you transfer the highest top non-yellow card without {c} to my board!`,
    `You may splay your purple cards up.`,
    `Junk all cards in the {0} deck.`,
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const topNonCoins = game
        .cards
        .tops(player)
        .filter(card => card.color !== 'yellow')
        .filter(card => !card.checkHasBiscuit('c'))

      const card = game.actions.chooseHighest(player, topNonCoins, 1)[0]
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['purple'], 'up')
    },

    (game, player, { self }) => {
      game.actions.junkDeck(player, game.getEffectAge(self, 10))
    },
  ],
  echoImpl: (game, player) => {
    const age = game.actions.chooseAge(player)
    game.actions.drawAndScore(player, age)
  },
}
