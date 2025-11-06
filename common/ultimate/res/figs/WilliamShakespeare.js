module.exports = {
  id: `William Shakespeare`,  // Card names are unique in Innovation
  name: `William Shakespeare`,
  color: `purple`,
  age: 4,
  expansion: `figs`,
  biscuits: `4*hs`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each {h} on your board provides one additional point toward your score.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        let count = 0
        for (const color of game.util.colors()) {
          const zone = game.zones.byPlayer(player, color)
          const cards = zone.cards()
          for (const card of cards) {
            if (card.checkBiscuitIsVisible('h')) {
              count += 1
            }
          }
        }
        return count
      }
    }
  ]
}
