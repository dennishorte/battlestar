const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Marilyn Diptych`
  this.color = `purple`
  this.age = 9
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `You may score a card from your hand. You may transfer any card from your score pile to your hand. If you have exactly 25 points, you win.`
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
