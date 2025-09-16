module.exports = {
  id: `Muhammad Yunus`,  // Card names are unique in Innovation
  name: `Muhammad Yunus`,
  color: `green`,
  age: 10,
  expansion: `figs`,
  biscuits: `c*hc`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `If any player would take a Dogma action, first you may return a card from your hand. If you do, you have the sole majority in its featured icon until the end of the action.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { owner }) => {
        const returned = game.actions.chooseAndReturn(
          owner,
          game.cards.byPlayer(owner, 'hand'),
          { min: 0, max: 1 }
        )

        if (returned && returned.length > 0) {
          game.log.add({
            template: '{player} has the sole majority',
            args: { player: owner }
          })
          game.state.dogmaInfo.soleMajority = owner
        }
      }
    }
  ]
}
