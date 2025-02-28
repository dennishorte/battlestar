const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Camouflage`  // Card names are unique in Innovation
  this.name = `Camouflage`
  this.color = `red`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `fhfl`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either tuck exactly two top cards of different colors and equal value on your board, then safeguard them, or score exactly two of your secrets of equal value.`,
    `Draw a {7} for each special achievement you have.`
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
