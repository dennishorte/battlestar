export default {
  id: `Nelson Mandela`,  // Card names are unique in Innovation
  name: `Nelson Mandela`,
  color: `red`,
  age: 9,
  expansion: `figs`,
  biscuits: `lphl`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would dogma a card as your second action, instead super-execute the card.`,
    `Each two {p} on your board counts as an achievement.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game) => game.state.actionNumber === 2,
      func: (game, player, { card, self }) => {
        game.aSuperExecute(self, player, card)
      },
    },
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const personBiscuits = player.biscuits().p
        return Math.floor(personBiscuits / 2)
      }
    }
  ]
}
