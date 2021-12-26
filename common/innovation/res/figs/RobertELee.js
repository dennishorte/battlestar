const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Robert E. Lee`
  this.color = `red`
  this.age = 7
  this.biscuits = `&hll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Transfer a top card with a {l} from anywhere to any player's board.`
  this.triggers = [
    `You may issue a War Decree with any two figures.`,
    `Each seven {l} on your board counts as an achievement.`
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