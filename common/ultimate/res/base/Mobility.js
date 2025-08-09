module.exports = {
  name: `Mobility`,
  color: `red`,
  age: 8,
  expansion: `base`,
  biscuits: `hfif`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer your two highest non-red top cards without {f} of different colors from your board to my score pile! If you transfer any, draw an {8}!`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      let transferred = false
      const destination = game.zones.byPlayer(leader, 'score')
      const choices = game
        .cards.tops(player)
        .filter(card => card.color !== 'red')
        .filter(card => !card.checkHasBiscuit('f'))
      const highest = game.util.highestCards(choices)

      if (highest.length >= 2) {
        const cards = game.actions.chooseAndTransfer(player, highest, destination, { count: 2 })
        if (cards && cards.length > 0) {
          transferred = true
        }
      }
      else if (highest.length === 1) {
        const card = game.actions.transfer(player, highest[0], destination)
        if (card) {
          transferred = true
        }

        const remaining = choices
          .filter(other => !highest.includes(other))
        const highestRemaining = game.util.highestCards(remaining)
        const seconds = game.actions.chooseAndTransfer(player, highestRemaining, destination)
        if (seconds && seconds.length > 0) {
          transferred = true
        }
      }

      if (transferred) {
        game.actions.draw(player, { age: game.getEffectAge(self, 8) })
      }
    }
  ],
}
