const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Machine Gun`  // Card names are unique in Innovation
  this.name = `Machine Gun`
  this.color = `red`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `ff&h`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `If you have five top cards, draw and score a {7}.`
  this.karma = []
  this.dogma = [
    `I demand you transfer all of your top cards with a bonus to my score pile! If you transferred any, draw a {7}!`,
    `Return all your non-red top cards.`
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
