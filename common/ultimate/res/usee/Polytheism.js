module.exports = {
  name: `Polytheism`,
  color: `purple`,
  age: 1,
  expansion: `usee`,
  biscuits: `hssk`,
  dogmaBiscuit: `s`,
  dogma: [
    `Meld a card from your hand with no biscuit on a card already melded by you during this action due to Polytheism. If you do, repeat this effect.`,
    `Draw and tuck a {1}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const meldedBiscuits = game.utilEmptyBiscuits()

      while (true) {
        const hand = game.cards.byPlayer(player, 'hand')
        const choices = hand.filter(c => ![...c.biscuits].some(b => b in meldedBiscuits && meldedBiscuits[b] > 0))
        const melded = game.actions.chooseAndMeld(player, choices, { count: 1 })

        if (melded.length > 0) {
          for (const b of melded[0].biscuits) {
            if (b in meldedBiscuits) {
              meldedBiscuits[b] += 1
            }
          }
          continue
        }
        else {
          break
        }
      }
    },
    (game, player, { self }) => {
      game.actions.drawAndTuck(player, game.getEffectAge(self, 1))
    }
  ],
}
