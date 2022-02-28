const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Saxophone`  // Card names are unique in Innovation
  this.name = `Saxophone`
  this.color = `purple`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `7ch7`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your purple cards up.`,
    `If the MUSIC_HEX for Bell, Flute, Piano, and Saxophone are visible anywhere, you win. Otherwise, draw a {7} for each MUSIC_HEX that is visible.`
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
