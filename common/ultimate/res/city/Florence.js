const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Florence`  // Card names are unique in Innovation
  this.name = `Florence`
  this.color = `purple`
  this.age = 4
  this.expansion = `city`
  this.biscuits = `css4<h`
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
