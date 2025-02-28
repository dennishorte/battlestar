const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fortune Cookie`  // Card names are unique in Innovation
  this.name = `Fortune Cookie`
  this.color = `purple`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `hllc`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have exactly seven of any icon on your board, draw and score a {7}; exactly eight, splay your green or purple cards right and draw an {9}; exactly nine, draw a {7}.`
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
