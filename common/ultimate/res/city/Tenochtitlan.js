const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tenochtitlan`  // Card names are unique in Innovation
  this.name = `Tenochtitlan`
  this.color = `red`
  this.age = 4
  this.expansion = `city`
  this.biscuits = `kk4s<h`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = []

  this.dogmaImpl = [
    (game, player) => {

    },
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
