const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Metalworking`  // Card names are unique in Innovation
  this.name = `Metalworking`
  this.color = `red`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {1}. If it has a {k}, score it and repeat this dogma effect. Otherwise, keep it.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.aDraw(player, { age: game.getEffectAge(this, 1), reveal: true })
        if (card.checkHasBiscuit('k')) {
          game.aScore(player, card)
        }
        else {
          break
        }
      }
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
