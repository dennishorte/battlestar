const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Xianrendong Shards`  // Card names are unique in Innovation
  this.name = `Xianrendong Shards`
  this.color = `yellow`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal three cards from your hand. Score two, then tuck the other. If the scored cards were the same color, draw three {1}s.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReveal(
        player,
        game.getCardsByZone(player, 'hand'),
        { count: 3 }
      )

      if (cards.length > 0) {
        const toScore = game.aChooseCards(player, cards, { count: 2, title: 'Card to score' })
        const scored = game.aScoreMany(player, toScore)

        const remaining = cards.filter(card => !toScore.includes(card))
        if (remaining.length > 0) {
          game.aTuck(player, remaining[0])
        }

        if (scored.length == 2 && scored[0].color === scored[1].color) {
          game.aDraw(player, { age: game.getEffectAge(this, 1) })
          game.aDraw(player, { age: game.getEffectAge(this, 1) })
          game.aDraw(player, { age: game.getEffectAge(this, 1) })
        }
      }
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
