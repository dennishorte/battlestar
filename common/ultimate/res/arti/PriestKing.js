const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Priest-King`  // Card names are unique in Innovation
  this.name = `Priest-King`
  this.color = `green`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score a card from your hand. If you have a top card matching its color, execute each of the top card's non-demand dogma effects. Do not share them.`,
    `Claim an achievement, if eligible.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        const top = game.getTopCard(player, card.color)
        if (top) {
          game.aCardEffects(player, top, 'dogma')
        }
      }
    },

    (game, player) => {
      const choices = game.getEligibleAchievementsRaw(player)
      game.aChooseAndAchieve(player, choices)
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
