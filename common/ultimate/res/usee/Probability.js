const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Probability`  // Card names are unique in Innovation
  this.name = `Probability`
  this.color = `blue`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand.`,
    `Draw and meld two {5}, then return them. If exactly two different icon types appear on the drawn cards, draw and score two {5}. If exactly four different icon types appear, draw a {5}. Draw a {4}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cardsInHand = game.getCardsByZone(player, 'hand')
      game.aReturnMany(player, cardsInHand)
    },
    (game, player) => {
      const card1 = game.aDrawAndMeld(player, game.getEffectAge(this, 5))
      const card2 = game.aDrawAndMeld(player, game.getEffectAge(this, 5))
      
      game.aReturn(player, card1)
      game.aReturn(player, card2)

      const drawnBiscuits = [...new Set(card1.biscuits + card2.biscuits)].length
      
      if (drawnBiscuits === 2) {
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
      } else if (drawnBiscuits === 4) {
        game.aDraw(player, {age: game.getEffectAge(this, 5)})
      }

      game.aDraw(player, {age: game.getEffectAge(this, 4)})
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