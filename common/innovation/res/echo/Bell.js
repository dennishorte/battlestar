const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bell`  // Card names are unique in Innovation
  this.name = `Bell`
  this.color = `purple`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `kmk&`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `You may score a card from your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a {2}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 2))
    }
  ]
  this.echoImpl = (game, player) => {
    game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
  }
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
