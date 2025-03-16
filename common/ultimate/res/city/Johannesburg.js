const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Johannesburg`  // Card names are unique in Innovation
  this.name = `Johannesburg`
  this.color = `blue`
  this.age = 7
  this.expansion = `city`
  this.biscuits = `77sc7h`
  this.dogmaBiscuit = `s`
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
