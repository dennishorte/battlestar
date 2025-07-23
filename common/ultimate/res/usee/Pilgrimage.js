module.exports = {
  name: `Pilgrimage`,
  color: `red`,
  age: 1,
  expansion: `usee`,
  biscuits: `llhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may return a card of value 1 from your hand. If you do, safeguard an available achievement of value equal to the returned card, then repeat this effect using a value one higher.`,
    `You may junk all cards in the {1} deck.`
  ],
  dogmaImpl: [
    (game, player) => {
      let value = 1

      while (true) {
        const choices = game.cards.byPlayer(player, 'hand').filter(c => c.age === value)
        const card = game.actions.chooseAndReturn(player, choices, { min: 0, max: 1 })[0]

        if (!card) {
          break
        }

        const availableAchievements = game.getAvailableAchievementsByAge(player, value)

        if (availableAchievements.length > 0) {
          game.actions.safeguard(player, availableAchievements[0])
        }
        else {
          game.log.addNoEffect()
        }

        value++
      }
    },
    (game, player) => {
      game.aJunkDeck(player, 1, { optional: true })
    }
  ],
}
