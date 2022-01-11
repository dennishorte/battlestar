const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Big Bang`  // Card names are unique in Innovation
  this.name = `The Big Bang`
  this.color = `purple`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Execute the non-demand effects of your top blue card, without sharing. If this caused any change to occur, draw and remove a {0} from the game, then repeat this effect.`
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
