const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Warsaw`  // Card names are unique in Innovation
  this.name = `Warsaw`
  this.color = `red`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `ibsi=h`
  this.dogmaBiscuit = `i`
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
