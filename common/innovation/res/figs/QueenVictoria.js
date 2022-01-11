const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Queen Victoria`  // Card names are unique in Innovation
  this.name = `Queen Victoria`
  this.color = `purple`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Transfer a figure from any score pile to yours.`
  this.karma = [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would claim a standard achievement, first make an achievement available from any lower non-empty age.`
  ]
  this.dogma = []

  this.dogmaImpl = []
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
