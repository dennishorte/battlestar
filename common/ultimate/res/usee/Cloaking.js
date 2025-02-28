const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cloaking`  // Card names are unique in Innovation
  this.name = `Cloaking`
  this.color = `red`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `hsfs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer one of your claimed standard achievements to my safe!`
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
