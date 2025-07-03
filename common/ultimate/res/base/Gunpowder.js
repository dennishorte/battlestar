module.exports = {
  name: `Gunpowder`,
  color: `red`,
  age: 4,
  expansion: `base`,
  biscuits: `hfcf`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer a top card with a {k} from your board to my score pile!`,
    `If any card was transferred due to the demand, draw and score a {2}.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      const cards = game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'))
      if (cards && cards.length > 0) {
        game.state.dogmaInfo.gunpowderCardWasTransferred = true
      }
    },

    (game, player, { self }) => {
      if (game.state.dogmaInfo.gunpowderCardWasTransferred) {
        game.aDrawAndScore(player, game.getEffectAge(self, 2))
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
