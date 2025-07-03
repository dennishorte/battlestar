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
      const destination = game.getZoneByPlayer(leader, 'score')
      const choices = game
        .getTopCards(player)
        .filter(card => card.color !== 'red')
        .filter(card => !card.checkHasBiscuit('f'))
      const highest = game.utilHighestCards(choices)

      if (highest.length >= 2) {
        const cards = game.aChooseAndTransfer(player, highest, destination, { count: 2 })
        if (cards && cards.length > 0) {
          transferred = true
        }
      }
      else if (highest.length === 1) {
        const card = game.aTransfer(player, highest[0], destination)
        if (card) {
          transferred = true
        }

        const remaining = choices
          .filter(other => !highest.includes(other))
        const highestRemaining = game.utilHighestCards(remaining)
        const seconds = game.aChooseAndTransfer(player, highestRemaining, destination)
        if (seconds && seconds.length > 0) {
          transferred = true
        }
      }

      if (transferred) {
        game.aDraw(player, { age: game.getEffectAge(self, 8) })
      }
    }
  ],
}
