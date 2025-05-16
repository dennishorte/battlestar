const CardBase = require(`../CardBase.js`)
function Card() {
  this.id = `Masonry`  // Card names are unique in Innovation
  this.name = `Masonry`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may meld any number of cards from your hand, each with a {k}.`,
    `If you have exactly three red cards on your board, claim the Monument achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      const cards = game.aChooseCards(player, choices, { min: 0, max: choices.length })
      if (cards) {
        game.aMeldMany(player, cards)
      }
    },

    (game, player) => {
      const redCards = game.getCardsByZone(player, 'red')

      if (redCards.length === 3 && game.checkAchievementAvailable('Monument')) {
        game.aClaimAchievement(player, { name: 'Monument' })
      }
      else {
        game.log.addNoEffect()
      }
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
