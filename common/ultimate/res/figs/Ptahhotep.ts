export default {
  id: `Ptahhotep`,  // Card names are unique in Innovation
  name: `Ptahhotep`,
  color: `purple`,
  age: 1,
  expansion: `figs`,
  biscuits: `hpkk`,
  dogmaBiscuit: `k`,
  karma: [
    `If you would dogma a card as your second action, instead score a card from your hand. If you do, super-execute the scored card.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game) => game.state.actionNumber === 2,
      func: (game, player, { self }) => {
        const scored = game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'))[0]

        if (scored) {
          game.aSuperExecute(self, player, scored)
        }
      }
    }
  ]
}
