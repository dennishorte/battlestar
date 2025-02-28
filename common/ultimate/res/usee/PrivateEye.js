const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Private Eye`  // Card names are unique in Innovation
  this.name = `Private Eye`
  this.color = `blue`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `llsh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal your hand! Transfer the card in your hand of my choice to my board! Draw a {7}!`,
    `Score one of your secrets.`,
    `You may splay your blue cards right.`
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
