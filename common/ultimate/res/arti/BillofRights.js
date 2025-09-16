module.exports = {
  name: `Bill of Rights`,
  color: `red`,
  age: 5,
  expansion: `arti`,
  biscuits: `hlss`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to choose a color where you have more visible cards than I do! Transfer all cards of that color from your board to my board, from the bottom up!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .utilColors()
        .filter(color => {
          const yours = game.zones.byPlayer(player, color).numVisibleCards()
          const mine = game.zones.byPlayer(leader, color).numVisibleCards()
          return yours > mine
        })
      const colors = game.actions.choose(player, choices, { title: 'Choose a Color' })
      if (colors && colors.length > 0) {
        const toTransfer = game.cards.byPlayer(player, colors[0]).reverse()
        const dest = game.zones.byPlayer(leader, colors[0])
        game.actions.transferMany(player, toTransfer, dest, { ordered: true })
      }
    }
  ],
}
