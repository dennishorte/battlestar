const util = require('../../../lib/util.js')

module.exports = {
  name: `Brethren of Purity`,
  color: `blue`,
  age: 3,
  expansion: `usee`,
  biscuits: `sslh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld a {3} or a card of value one higher than the last card melded due to Brethren of Purity during this action. If you meld over a card with a {s}, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const baseAge = game.getEffectAge(self, 3)

      if (!game.state.dogmaInfo.brethrenLastMeldedAgePlusOne) {
        game.state.dogmaInfo.brethrenLastMeldedAgePlusOne = baseAge
      }

      while (true) {
        const choices = util.array.distinct([baseAge, game.state.dogmaInfo.brethrenLastMeldedAgePlusOne])
        const age = game.aChooseAge(player, choices)
        const card = game.aDrawAndMeld(player, age)

        if (card) {
          game.state.dogmaInfo.brethrenLastMeldedAgePlusOne = card.getAge() + 1

          const meldedOver = game.getCardsByZone(player, card.color)[1]
          if (meldedOver && meldedOver.checkHasBiscuit('s')) {
            continue
          }
        }

        break
      }
    },
  ],
}
