const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Polytheism`  // Card names are unique in Innovation
  this.name = `Polytheism`
  this.color = `purple`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `hssk`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand with no icon on a card already melded by you during this action due to Polytheism. If you do, repeat this effect.`,
    `Draw and tuck a [1].`
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
