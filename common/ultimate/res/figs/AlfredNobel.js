module.exports = {
  id: `Alfred Nobel`,  // Card names are unique in Innovation
  name: `Alfred Nobel`,
  color: `green`,
  age: 7,
  expansion: `figs`,
  biscuits: `chc*`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `Each icon type on your board counts as an achievement, if you have at least twice as many of that icon as every other player.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'extra-achievements',
      func(game, player) {
        const biscuits = game.getBiscuits()
        const playerBiscuits = biscuits[player.name]

        let bonusAchievements = 0
        for (const biscuit of Object.keys(playerBiscuits)) {
          // Must have at least one of these biscuits for it to count.
          if (playerBiscuits[biscuit] === 0) {
            continue
          }

          let match = true
          for (const opp of game.getPlayerOpponents(player)) {
            const oppBiscuits = biscuits[opp.name]
            if (playerBiscuits[biscuit] < oppBiscuits[biscuit] * 2) {
              match = false
              break
            }
          }

          if (match) {
            bonusAchievements += 1
          }
        }

        return bonusAchievements
      }
    }
  ]
}
