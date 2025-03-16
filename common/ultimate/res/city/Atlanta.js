const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Atlanta`  // Card names are unique in Innovation
  this.name = `Atlanta`
  this.color = `blue`
  this.age = 10
  this.expansion = `city`
  this.biscuits = `aiis+h`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = []

  this.dogmaImpl = [
    (game, player) => {

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
