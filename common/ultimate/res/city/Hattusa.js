const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hattusa`  // Card names are unique in Innovation
  this.name = `Hattusa`
  this.color = `purple`
  this.age = 1
  this.expansion = `city`
  this.biscuits = `lllkkh`
  this.dogmaBiscuit = `l`
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
