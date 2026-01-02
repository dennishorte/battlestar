module.exports = {
  id: `Ximen Bao`,  // Card names are unique in Innovation
  name: `Ximen Bao`,
  color: `yellow`,
  age: 2,
  expansion: `figs`,
  biscuits: `p2hl`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `If you would issue a decree, first junk all cards from all opponents' hands.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: ['decree'],
      kind: 'would-first',
      matches: () => true,
      func(game, player) {
        const toJunk = game
          .players
          .opponents(player)
          .flatMap(opponent => game.cards.byPlayer(opponent, 'hand'))

        game.actions.junkMany(player, toJunk, { ordered: true })
      }
    }
  ]
}
