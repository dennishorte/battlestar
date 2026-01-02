module.exports = {
  id: `Rhazes`,  // Card names are unique in Innovation
  name: `Rhazes`,
  color: `yellow`,
  age: 3,
  expansion: `figs`,
  biscuits: `hllp`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would draw a card, first tuck a card of the same value from your hand or from an opponent's score pile.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { age }) => {
        const handCards = game
          .cards
          .byPlayer(player, 'hand')
          .filter(other => other.getAge() === age)
        const scoreCards = game
          .players
          .opponents(player)
          .flatMap(opponent => game.cards.byPlayer(opponent, 'score'))
          .filter(card => card.getAge() === age)
        game.actions.chooseAndTuck(player, [...handCards, ...scoreCards])
      }
    }
  ]
}
