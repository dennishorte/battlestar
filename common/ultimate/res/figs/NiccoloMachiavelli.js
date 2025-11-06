module.exports = {
  id: `Niccolo Machiavelli`,  // Card names are unique in Innovation
  name: `Niccolo Machiavelli`,
  color: `purple`,
  age: 4,
  expansion: `figs`,
  biscuits: `&ssh`,
  dogmaBiscuit: `s`,
  karma: [
    `Each color splayed right on your board but not splayed in any direction on any other player's board counts as an achievement.`
  ],
  karmaImpl: [
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const othersSplayedColors = game
          .players.all()
          .filter(other => other !== player)
          .flatMap(other => {
            return game
              .util.colors()
              .filter(color => game.zones.byPlayer(other, color).splay !== 'none')
          })
        return game
          .util.colors()
          .filter(color => game.zones.byPlayer(player, color).splay === 'right')
          .filter(color => !othersSplayedColors.includes(color))
          .length
      }
    }
  ]
}
