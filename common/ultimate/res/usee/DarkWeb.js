const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dark Web`  // Card names are unique in Innovation
  this.name = `Dark Web`
  this.color = `red`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `fhii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Unsplay any color on any board.`,
    `Choose to either safeguard any number of available standard achievements, or achieve any number of secrets from your safe regardless of eligibility.`
  ]

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
