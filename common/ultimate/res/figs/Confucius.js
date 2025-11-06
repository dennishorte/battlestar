module.exports = {
  id: `Confucius`,  // Card names are unique in Innovation
  name: `Confucius`,
  color: `purple`,
  age: 2,
  expansion: `figs`,
  biscuits: `hl&3`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would take a Dogma action and activate a card with a {k} as a featured icon, instead choose any other icon on your board as the featured icon.`
  ],
  karmaImpl: [
    {
      trigger: 'featured-biscuit',
      matches: (game, player, { biscuit }) => biscuit === 'k',
      func: (game, player) => {
        const biscuits = player.biscuits()
        const choices = Object
          .entries(biscuits)
          .filter(([biscuit, count]) => count > 0)
          .map(([biscuit, count]) => biscuit)
          .filter(biscuit => biscuit !== 'k')

        const biscuit = game.requestInputSingle({
          actor: player.name,
          title: 'Choose a Biscuit',
          choices,
        })[0]

        return biscuit
      }
    }
  ]
}
