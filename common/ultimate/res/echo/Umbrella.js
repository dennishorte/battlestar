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
      const returned = game.aChooseAndReturn(player, game.cards.byZone(player, 'hand'), { min: 0, max: 999 })
      const scoreCount = returned.length * 2
      game.aChooseAndScore(player, game.cards.byZone(player, 'hand'), { count: scoreCount })
    }
  ],
  echoImpl: (game, player) => {
    game.aChooseAndMeld(player, game.cards.byZone(player, 'hand'), { min: 0, max: 1 })
  },
}
