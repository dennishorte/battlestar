module.exports = {
  id: `Muhammad Yunus`,  // Card names are unique in Innovation
  name: `Muhammad Yunus`,
  color: `green`,
  age: 10,
  expansion: `figs`,
  biscuits: `cphc`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If a player would take a Dogma action, first you may return your bottom green card. If you do, you have sole majority in every icon during the action.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { owner }) => {
        const returned = game.actions.chooseAndReturn(
          owner,
          [game.cards.bottom(owner, 'green')],
          { min: 0, max: 1 }
        )[0]

        if (returned) {
          game.log.add({
            template: '{player} has the sole majority for all biscuits during this action',
            args: { player: owner }
          })
          game.state.dogmaInfo.soleMajorityPlayerId = owner.id
          game.state.dogmaInfo.recalculateSharingAndDemanding()
        }
      }
    }
  ]
}
