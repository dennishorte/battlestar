const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Area 51`  // Card names are unique in Innovation
  this.name = `Area 51`
  this.color = `green`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your green cards up.`,
    `Choose to either draw a {9}, or safeguard an available standard achievement.`,
    `Reveal one of your secrets, and super-execute it if it is your turn.`
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
