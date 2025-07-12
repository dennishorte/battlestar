const util = require('../../../lib/util.js')

module.exports = {
  name: `Padlock`,
  color: `red`,
  age: 2,
  expansion: `usee`,
  biscuits: `ckhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer one of your secrets to the available achievements!`,
    `If no card was transferred due to the demand, you may score up to three cards from your hand of different values.`
  ],
  dogmaImpl: [
    (game, player) => {
      const secrets = game.cards.byPlayer(player, 'safe')

      if (secrets.length === 0) {
        game.log.add({ template: 'no secrets to transfer' })
        return
      }

      const secret = game.actions.chooseCards(player, secrets, { hidden: true })[0]
      const transferred = game.aTransfer(player, secret, game.zones.byId('achievements'))
      if (transferred) {
        game.state.dogmaInfo.padlockCardTransferred = true
      }
    },
    (game, player) => {
      if (!game.state.dogmaInfo.padlockCardTransferred) {
        game.aChooseAndScore(player, game.cards.byPlayer(player, 'hand'), {
          title: 'Choose up the three cards of different values',
          min: 0,
          max: 3,
          guard: (cards) => util.array.isDistinct(cards.map(c => c.getAge()))
        })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
