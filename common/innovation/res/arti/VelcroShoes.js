const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Velcro Shoes`  // Card names are unique in Innovation
  this.name = `Velcro Shoes`
  this.color = `red`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `ffih`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a {9} from your hand to my hand! If you do not, transfer a {9} from your score pile to my score pile! If you do neither, I win!`
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
