const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Tecumseh`
  this.color = `red`
  this.age = 6
  this.biscuits = `fh&f`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw and tuck a {6}.`
  this.triggers = [
    `If you would tuck a card with a {f}, first return a top card with a {f} from another player's board.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
