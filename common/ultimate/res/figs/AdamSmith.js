module.exports = {
  id: `Adam Smith`,  // Card names are unique in Innovation
  name: `Adam Smith`,
  color: `green`,
  age: 6,
  expansion: `figs`,
  biscuits: `pfcc`,
  dogmaBiscuit: `c`,
  karma: [
    `Each {c} on your board provides two additional {c}.`,
    `If you would take a dogma action with no player eligible to share, first junk all cards in the {6} deck. If you don't, splay one color of your cards right.`
  ],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const extras = game.util.emptyBiscuits()
        extras.c = biscuits.c * 2
        return extras
      }
    },
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { sharing }) => sharing.length === 0,
      func: (game, player) => {
        const junkedCards = game.actions.junkDeck(player, 6)

        if (!junkedCards) {
          game.actions.chooseAndSplay(player, null, 'right', { count: 1 })
        }
      },
    },
  ]
}
