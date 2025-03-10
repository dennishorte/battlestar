const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Black Market`  // Card names are unique in Innovation
  this.name = `Black Market`
  this.color = `green`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `hcfc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may safeguard a card from your hand. If you do, reveal two available standard achievements. You may meld a revealed card with no {i} or {p}. Return each revealed card you do not meld.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const safeguarded = game.aChooseAndSafeguard(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })

      if (safeguarded && safeguarded.length > 0) {
        const availableAchievements = game.getAvailableStandardAchievements(player)
        const achievements = game.aChooseCards(player, availableAchievements, {
          title: 'Choose two available achievements to reveal',
          hidden: true,
          count: 2,
        })

        game.aRevealMany(player, achievements, { ordered: true })

        const meldableAchievements = achievements.filter(card => !card.checkHasBiscuit('i') && !card.checkHasBiscuit('p'))

        const toMeld = game.aChooseCard(player, meldableAchievements, { min: 0, max: 1 })

        if (toMeld) {
          game.aMeld(player, toMeld)
        }

        // No need to return the achievements that weren't melded, since they were never moved.
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
