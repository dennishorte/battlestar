const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Gallery`
  this.name = `Gallery`
  this.color = `yellow`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `csch`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have a {2} in your score pile, draw a {6}.`,
    `If you have a {1} in your score pile, draw a {7}. Otherwise, draw a {5}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const scoreCards = game.getCardsByZone(player, 'score')
      if (scoreCards.some(card => card.age === game.getEffectAge(this, 2))) {
        game.aDraw(player, { age: game.getEffectAge(this, 6) })
      }
      else {
        game.log.addNoEffect()
      }
    },
    (game, player) => {
      const scoreCards = game.getCardsByZone(player, 'score')
      if (scoreCards.some(card => card.age === game.getEffectAge(this, 1))) {
        game.aDraw(player, { age: game.getEffectAge(this, 7) })
      }
      else {
        game.aDraw(player, { age: game.getEffectAge(this, 5) })
      }
    }
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
