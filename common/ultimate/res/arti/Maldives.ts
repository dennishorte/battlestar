export default {
  name: `Maldives`,
  color: `red`,
  age: 10,
  expansion: `arti`,
  biscuits: `ihii`,
  dogmaBiscuit: `i`,
  dogma: [
    `I compel you to return all cards in your hand but two! Return all cards in your score pile but two!`,
    `Return all cards in your score pile but four.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.cards.byPlayer(player, 'hand')
      const handCount = Math.max(0, hand.length - 2)
      game.actions.chooseAndReturn(player, hand, { count: handCount })

      const score = game.cards.byPlayer(player, 'score')
      const scoreCount = Math.max(0, score.length - 2)
      game.actions.chooseAndReturn(player, score, { count: scoreCount })
    },

    (game, player) => {
      const score = game.cards.byPlayer(player, 'score')
      const scoreCount = Math.max(0, score.length - 4)
      game.actions.chooseAndReturn(player, score, { count: scoreCount })
    },
  ],
}
