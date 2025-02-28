const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cabal`  // Card names are unique in Innovation
  this.name = `Cabal`
  this.color = `red`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `hffc`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all cards from your hand that have a value matching any of my secrets to my score pile! Draw a {5}!`,
    `Safeguard an available achievement of value equal to a top card on your board.`
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
