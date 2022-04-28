const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Noodles`  // Card names are unique in Innovation
  this.name = `Noodles`
  this.color = `yellow`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `khk1`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have more {1} in your hand than every other player, draw and score a {2}.`,
    `Draw and reveal a {1}. If it is yellow, score all {1}s from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const mine = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() === game.getEffectAge(this, 1))
        .length
      const theirs = game
        .getPlayerAll()
        .filter(other => other !== player)
        .map(player => game
          .getCardsByZone(player, 'hand')
          .filter(card => card.getAge() === game.getEffectAge(this, 1))
          .length
        )

      if (theirs.every(count => count < mine)) {
        game.aDrawAndScore(player, game.getEffectAge(this, 2))
      }
      else {
        game.mLogNoEffect()
      }
    },

    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 1))
      if (card && card.color === 'yellow') {
        const toScore = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.getAge() === 1)
        game.aScoreMany(player, toScore, { ordered: true })
      }
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
