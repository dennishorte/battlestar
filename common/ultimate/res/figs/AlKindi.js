module.exports = {
  id: `Al-Kindi`,  // Card names are unique in Innovation
  name: `Al-Kindi`,
  color: `purple`,
  age: 3,
  expansion: `figs`,
  biscuits: `hcc*`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would draw a card for sharing, first draw two cards of the same value.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      matches(game, player, { share }) {
        return share
      },
      func(game, player, { age }) {
        game.actions.draw(player, { age })
        game.actions.draw(player, { age })
        return 'would-first'
      }
    }
  ]
}
