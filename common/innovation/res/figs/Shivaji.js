const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shivaji`  // Card names are unique in Innovation
  this.name = `Shivaji`
  this.color = `red`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `&ffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Transfer one of your top cards to the available achievements.`
  this.karma = [
    `You may issue a War Decree with any two figures.`,
    `If an opponent would claim an achievement, first you claim it if eligible.`
  ]
  this.dogma = []

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
