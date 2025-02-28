const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Knights Templar`  // Card names are unique in Innovation
  this.name = `Knights Templar`
  this.color = `red`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `hlkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you unsplay a splayed color on your board! If you do, transfer the top card on your board of that color to my score pile!`,
    `You may splay your red or green cards left.`
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
