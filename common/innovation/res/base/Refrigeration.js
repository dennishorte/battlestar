const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Refrigeration`  // Card names are unique in Innovation
  this.name = `Refrigeration`
  this.color = `yellow`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `hllc`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return half (round down) of the cards in your hand!`,
    `You may score a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.getCardsByZone(player, 'hand')
      const count = Math.floor(cards.length / 2)
      game.aChooseAndReturn(player, cards, { count })
    },
    (game, player) => {
      game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
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
