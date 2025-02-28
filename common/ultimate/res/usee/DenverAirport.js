const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Denver Airport`  // Card names are unique in Innovation
  this.name = `Denver Airport`
  this.color = `green`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `cchp`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may achieve one of your secrets regardless of eligibility.`,
    `You may splay your purple cards up.`
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
