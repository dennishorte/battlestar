const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Marie Curie`  // Card names are unique in Innovation
  this.name = `Marie Curie`
  this.color = `blue`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `f&hf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw a {9}.`
  this.karma = [
    `Each different value present in your score pile above 6 counts as an achievement.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 9) })
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const ages = game
          .getCardsByZone(player, 'score')
          .filter(card => card.age > 6)
          .map(card => card.age)
        return util.array.distinct(ages).length
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
