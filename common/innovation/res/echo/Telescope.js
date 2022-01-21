const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Telescope`  // Card names are unique in Innovation
  this.name = `Telescope`
  this.color = `blue`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `h4s&`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {5}.`
  this.karma = []
  this.dogma = [
    `You may place a card from your forecast on top of its deck. If you do, achieve a card from your forecast if you meet the requirements to do so.`
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
