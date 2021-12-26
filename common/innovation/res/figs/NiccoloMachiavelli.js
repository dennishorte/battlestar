const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Niccolo Machiavelli`
  this.color = `purple`
  this.age = 4
  this.biscuits = `&ssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Splay one color right that you have splayed left.`
  this.triggers = [
    `Each color splayed right on your board but not splayed in any direction on any other player's board counts as an achievement.`
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