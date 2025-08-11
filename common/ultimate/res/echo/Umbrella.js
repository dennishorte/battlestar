module.exports = {
  name: `Umbrella`,
  color: `green`,
  age: 1,
  expansion: `echo`,
  biscuits: `llh&`,
  dogmaBiscuit: `l`,
  echo: `You may meld a card from your hand.`,
  dogma: [
    `Return any number of cards from your hand. Score two cards from your hand for every card you returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 999 })
      const scoreCount = returned.length * 2
      game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { count: scoreCount })
    }
  ],
  echoImpl: (game, player) => {
    game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })
  },
}
