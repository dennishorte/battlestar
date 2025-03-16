const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chicago`  // Card names are unique in Innovation
  this.name = `Chicago`
  this.color = `yellow`
  this.age = 8
  this.expansion = `city`
  this.biscuits = `88il8h`
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
