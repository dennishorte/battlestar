const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jiskairumoko Necklace`  // Card names are unique in Innovation
  this.name = `Jiskairumoko Necklace`
  this.color = `green`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hckk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return a card from your score pile! if you do, transfer an achievement of the same value from your achievements to mine!`
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
