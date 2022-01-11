const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Maastrict Treaty`  // Card names are unique in Innovation
  this.name = `Maastrict Treaty`
  this.color = `green`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have the most cards in your score pile, you win.`
  ]

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
