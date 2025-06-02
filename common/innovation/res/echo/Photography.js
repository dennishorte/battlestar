const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Photography`  // Card names are unique in Innovation
  this.name = `Photography`
  this.color = `blue`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `&sh7`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Meld a card from your forecast.`
  this.karma = []
  this.dogma = [
    `I demand you take the highest top card from your board into your hand.`,
    `If you have at least three echo effects visible in one color, claim the History achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game.utilHighestCards(game.getTopCards(player))
      game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(player, 'hand'))
    },

    (game, player) => {
      if (!game.checkAchievementAvailable('History')) {
        game.log.addNoEffect()
      }

      const targetCount = 3
      const matches = game
        // Grab each stack
        .utilColors()
        .map(color => game.getZoneByPlayer(player, color))

        // Convert each stack to a count of echo effects
        .map(zone => zone
          .cards()
          .map(c => (game.getBiscuitsRaw(c, zone.splay).match(/&/g) || []).length )
          .reduce((prev, curr) => prev + curr, 0)
        )
        .some(count => count >= targetCount)

      if (matches) {
        game.aClaimAchievement(player, { name: 'History' })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ]
  this.echoImpl = (game, player) => {
    game.aChooseAndMeld(player, game.getCardsByZone(player, 'forecast'))
  }
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
