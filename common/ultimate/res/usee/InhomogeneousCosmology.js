const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Inhomogeneous Cosmology`  // Card names are unique in Innovation
  this.name = `Inhomogeneous Cosmology`
  this.color = `blue`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `ihii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may place a top card from your board on top of its deck. You may meld a card from your hand. If you do either, repeat this effect.`,
    `Draw an {11} for every color not on your board.`
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
