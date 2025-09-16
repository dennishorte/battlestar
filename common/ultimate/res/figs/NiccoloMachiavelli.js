module.exports = {
  id: `Niccolo Machiavelli`,  // Card names are unique in Innovation
  name: `Niccolo Machiavelli`,
  color: `purple`,
  age: 4,
  expansion: `figs`,
  biscuits: `&ssh`,
  dogmaBiscuit: `s`,
  echo: `Splay one color right that you have splayed left.`,
  karma: [
    `Each color splayed right on your board but not splayed in any direction on any other player's board counts as an achievement.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [
    (game, player) => {
      const choices = game
        .utilColors()
        .filter(color => game.getZoneByPlayer(player, color).splay === 'left')
      game.aChooseAndSplay(player, choices, 'right', { count: 1 })
    }
  ],
  karmaImpl: [
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const othersSplayedColors = game
          .getPlayerAll()
          .filter(other => other !== player)
          .flatMap(other => {
            return game
              .utilColors()
              .filter(color => game.getZoneByPlayer(other, color).splay !== 'none')
          })
        return game
          .utilColors()
          .filter(color => game.getZoneByPlayer(player, color).splay === 'right')
          .filter(color => !othersSplayedColors.includes(color))
          .length
      }
    }
  ]
}
