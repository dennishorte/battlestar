const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Swiss Bank Account`  // Card names are unique in Innovation
  this.name = `Swiss Bank Account`
  this.color = `green`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Safeguard an available achievement of value equal to the number of cards in your score pile. If you do, score all cards in your hand of its value.`,
    `Draw a {6} for each secret in your safe.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const scoreCount = game.getCardsByZone(player, 'score').length
      const achievement = game
        .getAvailableStandardAchievements(player)
        .filter(a => a.age === scoreCount)[0]

      if (achievement) {
        game.aSafeguard(player, achievement)
        const cardsInHand = game
          .getCardsByZone(player, 'hand')
          .filter(c => c.age === achievement.age)
        game.aScoreMany(player, cardsInHand)
      }
    },
    (game, player) => {
      const secretCount = game.getCardsByZone(player, 'safe').length
      for (let i = 0; i < secretCount; i++) {
        game.aDraw(player, { age: game.getEffectAge(this, 6) })
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
