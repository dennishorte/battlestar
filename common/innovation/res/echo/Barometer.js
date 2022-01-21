const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Barometer`  // Card names are unique in Innovation
  this.name = `Barometer`
  this.color = `yellow`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `l&lh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Transfer a {5} from your forecast to your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a card of value two higher than a bonus on any board.`,
    `You may return all the cards in your forecast. If any were blue, claim the Destiny achievement.`
  ]

  this.dogmaImpl = []
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
