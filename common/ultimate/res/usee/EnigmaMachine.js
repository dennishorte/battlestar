const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Enigma Machine`  // Card names are unique in Innovation
  this.name = `Enigma Machine`
  this.color = `red`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `iihi`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either safeguard all available standard achievements, transfer all your secrets to your hand, or transfer all cards in your hand to the available achievements.`,
    `Choose a color you have splayed left and splay it up.`
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
