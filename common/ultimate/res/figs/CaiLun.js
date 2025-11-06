module.exports = {
  id: `Cai Lun`,  // Card names are unique in Innovation
  name: `Cai Lun`,
  color: `yellow`,
  age: 2,
  expansion: `figs`,
  biscuits: `&cch`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would claim an achievement, first draw and foreshadow a {3}.`,
    `Each card in your forecast counts as an available achievement for you.`
  ],
  karmaImpl: [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        game.actions.drawAndForeshadow(player, game.getEffectAge(this, 3))
      }
    },
    {
      trigger: 'list-achievements',
      func(game, player) {
        return game.cards.byPlayer(player, 'forecast')
      }
    }
  ]
}
