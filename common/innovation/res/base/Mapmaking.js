const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Mapmaking`
  this.color = `green`
  this.age = 2
  this.biscuits = `hcck`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you transfer a {1} from your score pile, if it has any, to my score pile.`,
    `If any card was transferred due to the demand, draw and score a {1}.`
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