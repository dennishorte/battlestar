const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Brethren of Purity`  // Card names are unique in Innovation
  this.name = `Brethren of Purity`
  this.color = `blue`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `sslh`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {3} or a card of value one higher than the last card melded due to Brethren of Purity during this action. If you meld over a card with a {s}, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const baseAge = game.getEffectAge(this, 3)

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
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
