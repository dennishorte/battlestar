const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Oars`
  this.color = `red`
  this.age = 1
  this.biscuits = `kchk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you transfer a card wit ha {c} from your hand to my score pile! if you do, draw a {1}, and repeat this dogma effect!`,
    `If no cards were transferred due to this demand, draw a {1}.`
  ]

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