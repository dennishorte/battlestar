const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Globe`  // Card names are unique in Innovation
  this.name = `Globe`
  this.color = `green`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `f4fh`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return up to three cards from your hand of the same color. If you return one, splay any color left; two, right; three, up. If you returned at least one card, draw and foreshadow a {6}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colorChoices = util.array.distinct(
        game
          .getCardsByZone(player, 'hand')
          .map(card => card.color)
      )
      const colors = game.aChoose(player, colorChoices, { title: 'Choose a color of cards to return' })

      if (colors && colors.length > 0) {
        const color = colors[0]
        const returnChoices = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.color === color)
        const returned = game.aChooseAndReturn(player, returnChoices, { min: 0, max: 3 })
        if (returned && returned.length > 0) {
          let direction
          if (returned.length === 1) {
            direction = 'left'
          }
          else if (returned.length === 2) {
            direction = 'right'
          }
          else {
            direction = 'up'
          }
          game.aChooseAndSplay(player, null, direction, { count: 1 })

          game.aDrawAndForeshadow(player, game.getEffectAge(this, 6))
        }
      }
    }
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
