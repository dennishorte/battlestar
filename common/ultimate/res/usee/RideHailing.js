const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ride-Hailing`  // Card names are unique in Innovation
  this.name = `Ride-Hailing`
  this.color = `yellow`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your green cards up.`,
    `Meld a top non-yellow card with {p} from another player's board. If you do, self-execute it. Otherwise, draw an {11}.`
  ]

  this.dogmaImpl = [
    (game, player) => {

    },
  ]
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
