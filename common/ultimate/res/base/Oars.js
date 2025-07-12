module.exports = {
  name: `Oars`,
  color: `red`,
  age: 1,
  expansion: `base`,
  biscuits: `kchk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer a card with {c} from your hand to my score pile! If you do, draw a {1}, and repeat this effect!`,
    `If no cards were transferred due to this demand, draw a {1}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('c'))
      if (choices.length === 0) {
        game.log.addNoEffect()
      }

      const target = game.zones.byPlayer(leader, 'score')
      while (true) {
        const choices = game
          .cards.byPlayer(player, 'hand')
          .filter(card => card.checkHasBiscuit('c'))
        if (choices.length > 0) {
          const transferred = game.aChooseAndTransfer(player, choices, target)
          if (transferred && transferred.length > 0) {
            game.state.dogmaInfo.oarsCardTransferred = true
            game.aDraw(player, { age: game.getEffectAge(self, 1) })
            continue
          }
        }

        break
      }
    },

    (game, player, { self }) => {
      if (!game.state.dogmaInfo.oarsCardTransferred) {
        game.aDraw(player, { age: game.getEffectAge(self, 1) })
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
