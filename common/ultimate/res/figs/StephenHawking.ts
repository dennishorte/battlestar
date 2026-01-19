export default {
  id: `Stephen Hawking`,  // Card names are unique in Innovation
  name: `Stephen Hawking`,
  color: `blue`,
  age: 10,
  expansion: `figs`,
  biscuits: `bpsh`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would dogma a card, first score your bottom card of its color for each {h} in that color on your board.`,
    `If you would draw a card, first draw and tuck a card of the same value.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const cards = game.cards.byPlayer(player, card.color)
        const hexes = cards.filter(card => card.checkBiscuitIsVisible('h')).length

        for (let i = 0; i < hexes; i++) {
          game.actions.score(player, game.cards.bottom(player, card.color))
        }
      }
    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { age }) => {
        game.actions.drawAndTuck(player, age)
      }
    },
  ]
}
