const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `{name}`  // Card names are unique in Innovation
  this.name = `{name}`
  this.color = `{color}`
  this.age = {age}
  this.expansion = `{expansion}`
  this.biscuits = `{biscuits}`
  this.dogmaBiscuit = `{dogmaBiscuit}`
  this.inspire = `{inspire}`
  this.echo = `{echo}`
  this.karma = [{karma}]
  this.dogma = [{dogma}]

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
