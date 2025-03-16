const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Moscow`  // Card names are unique in Innovation
  this.name = `Moscow`
  this.color = `purple`
  this.age = 9
  this.expansion = `city`
  this.biscuits = `lsxl:h`
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
