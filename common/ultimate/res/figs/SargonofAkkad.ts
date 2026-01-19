export default {
  id: `Sargon of Akkad`,  // Card names are unique in Innovation
  name: `Sargon of Akkad`,
  color: `green`,
  age: 1,
  expansion: `figs`,
  biscuits: `1chp`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would not be eligible for sharing, instead become eligible for sharing and junk and available achievement of value 1.`
  ],
  karmaImpl: [
    {
      trigger: 'share-eligibility',
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player) => {
        const notEligibleCondition = !game.state.dogmaInfo.sharing.find(p => p.id === player.id)
        const notCurrentPlayerCondition = game.players.current().id !== player.id
        return notEligibleCondition && notCurrentPlayerCondition
      },
      func: (game, player) => {
        game.state.dogmaInfo.sharing.push(player)
        game.actions.junkAvailableAchievement(player, 1)
      }
    }
  ]
}
