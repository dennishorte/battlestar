module.exports = {
  id: `Plato`,  // Card names are unique in Innovation
  name: `Plato`,
  color: `purple`,
  age: 2,
  expansion: `figs`,
  biscuits: `shs*`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `Each splayed stack on your board provides one additional {k}, {s}, {l}, and {c}.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'calculate-biscuits',
      func(game, player) {
        const numSplayed = game
          .util.colors()
          .map(color => game.zones.byPlayer(player, color))
          .filter(zone => zone.splay !== 'none')
          .length

        const biscuits = game.utilEmptyBiscuits()
        biscuits.k = numSplayed
        biscuits.s = numSplayed
        biscuits.l = numSplayed
        biscuits.c = numSplayed

        return biscuits
      }
    }
  ]
}
