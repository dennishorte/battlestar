const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Lever`  // Card names are unique in Innovation
  this.name = `Lever`
  this.color = `blue`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `sh&s`
  this.dogmaBiscuit = `s`
  this.echo = `Draw two {2}.`
  this.karma = []
  this.dogma = [
    `You may return any number of cards from your hand. For every two cards of matching value returned, draw a card of value one higher.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 999 })

      if (returned) {
        const toDraw = []
        const byAge = util.array.groupBy(returned, card => card.getAge())
        for (const [age, cards] of Object.entries(byAge)) {
          const count = Math.floor(cards.length / 2)
          for (let i = 0; i < count; i++) {
            toDraw.push(parseInt(age) + 1)
          }
        }

        toDraw.sort()

        while (toDraw.length > 0) {
          const age = game.aChooseAge(player, toDraw)
          game.aDraw(player, { age })
          toDraw.splice(toDraw.indexOf(age), 1)
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 2) })
    game.aDraw(player, { age: game.getEffectAge(this, 2) })
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
