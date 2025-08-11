module.exports = {
  name: `Flash Drive`,
  color: `green`,
  age: 10,
  expansion: `echo`,
  biscuits: `ffhf`,
  dogmaBiscuit: `f`,
  echo: ``,
  dogma: [
    `I demand you return four cards from your score pile.`,
    `Return a card from your score pile. If you do, you may splay any one color of your cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'), { count: 4 })
    },

    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'))
      if (returned && returned.length > 0) {
        game.actions.chooseAndSplay(player, null, 'up')
      }
    },
  ],
  echoImpl: [],
}
