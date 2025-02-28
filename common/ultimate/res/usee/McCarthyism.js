const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `McCarthyism`  // Card names are unique in Innovation
  this.name = `McCarthyism`
  this.color = `red`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `fiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and meld an {8}! If Socialism is a top card on your board, you lose!`,
    `Score your top purple card.`,
    `You may splay your red or blue cards up.`
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
