const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `MP3`  // Card names are unique in Innovation
  this.name = `MP3`
  this.color = `yellow`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `cahc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return any number of cards from your hand. For each card returned, claim two standard achievements for which you are eligible.`,
    `Draw and score a card of value equal to a bonus on your board.`
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
