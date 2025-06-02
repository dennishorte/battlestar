const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Probability`  // Card names are unique in Innovation
  this.name = `Probability`
  this.color = `blue`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand.`,
    `Draw and reveal two {6}, then return them. If exactly two different biscuit types appear on the drawn cards, draw and score two {6}. If exactly four different biscuit types appear, draw a {7}. Draw a {6}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cardsInHand = game.getCardsByZone(player, 'hand')
      game.aReturnMany(player, cardsInHand)
    },
    (game, player) => {
      const card1 = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
      const card2 = game.aDrawAndReveal(player, game.getEffectAge(this, 6))

      game.aReturn(player, card1)
      game.aReturn(player, card2)

      const drawnBiscuits = game.utilCombineBiscuits(
        game.utilParseBiscuits(card1.biscuits),
        game.utilParseBiscuits(card2.biscuits),
      )

      const numberOfBiscuits = Object.values(drawnBiscuits).filter(x => x > 0).length

      game.log.add({ template: `The revealed cards had ${numberOfBiscuits} biscuit types total.` })

      if (numberOfBiscuits === 2) {
        game.aDrawAndScore(player, game.getEffectAge(this, 6))
        game.aDrawAndScore(player, game.getEffectAge(this, 6))
      }
      else if (numberOfBiscuits === 4) {
        game.aDraw(player, {age: game.getEffectAge(this, 7)})
      }

      game.aDraw(player, {age: game.getEffectAge(this, 6)})
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
