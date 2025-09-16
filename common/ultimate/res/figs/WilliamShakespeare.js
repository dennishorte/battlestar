module.exports = {
  id: `William Shakespeare`,  // Card names are unique in Innovation
  name: `William Shakespeare`,
  color: `purple`,
  age: 4,
  expansion: `figs`,
  biscuits: `4*hs`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each {h} on your board provides one additional point toward your score.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        let count = 0
        for (const color of game.utilColors()) {
          const zone = game.getZoneByPlayer(player, color)
          const cards = zone.cards()
          for (const card of cards) {
            const splay = cards[0] === card ? 'top' : zone.splay
            if (card.checkBiscuitIsVisible('h', splay)) {
              count += 1
            }
          }
        }
        return count
      }
    }
  ]
}
