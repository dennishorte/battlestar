const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Archery`  // Card names are unique in Innovation
  this.name = `Archery`
  this.color = `red`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kshk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw a {1}, then transfer the highest card in your hand to my hand!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      game.aDraw(player, { age: game.getEffectAge(this, 1) })
      const cards = game.aChooseHighest(player, game.getCardsByZone(player, 'hand'), 1)
      const leaderHand = game.getZoneByPlayer(leader, 'hand')
      game.aTransfer(player, cards[0], leaderHand)
    }
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
