module.exports = {
  id: `Sheikh Tamim`,  // Card names are unique in Innovation
  name: `Sheikh Tamim`,
  color: `red`,
  age: 11,
  expansion: `figs`,
  biscuits: `cchp`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would dogma a card using a featured icon, first you may return a card from your hand with that icon. If you do, issue a Decree of the color matching the color of the returned card.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const mayReturn = game
          .cards
          .byPlayer(player, 'hand')
          .filter(card => card.checkHasBiscuit(game.state.dogmaInfo.featuredBiscuit))

        const returned = game.actions.chooseAndReturn(player, mayReturn, { min: 0 })[0]

        if (returned) {
          let decreeName
          switch (returned.color) {
            case 'red': decreeName = 'War'; break
            case 'yellow': decreeName = 'Expansion'; break
            case 'green': decreeName = 'Trade'; break
            case 'blue': decreeName = 'Advancement'; break
            case 'purple': decreeName = 'Rivalry'; break
            default:
              throw new Error('Unknown card color: ' + card.color)
          }

          game.aDecree(player, decreeName)
        }
      }
    }
  ]
}
