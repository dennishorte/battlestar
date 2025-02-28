const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Symbology`  // Card names are unique in Innovation
  this.name = `Symbology`
  this.color = `purple`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `sshk`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have at least four each of at least four icon on your board, draw a [3]. Otherwise, if you have three of three icons, draw a [2]. Otherwise, if you have two of two icons, draw a [1].`
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
