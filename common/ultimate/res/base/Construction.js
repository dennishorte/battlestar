const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Construction`  // Card names are unique in Innovation
  this.name = `Construction`
  this.color = `red`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer two cards from your hand to my hand! Draw a {2}!`,
    `If you are the only player with five top cards, claim the Empire achievement.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      // Choose two cards
      const cards = game.aChooseAndTransfer(
        player,
        game.getCardsByZone(player, 'hand'),
        game.getZoneByPlayer(leader, 'hand'),
        { min: 0, max: 2 }
      )
      
      // Draw a 2
      game.aDraw(player, { age: game.getEffectAge(this, 2) })
    },
    (game, player) => {
      const achievementAvailable = game.checkAchievementAvailable('Empire')
      const playerHasFive = game
        .getTopCards(player)
        .length === 5
      const othersHaveFive = game
        .getPlayerAll()
        .filter(p => p !== player)
        .map(p => game.getTopCards(p).length)
        .filter(count => count === 5)
        .length > 0

      if (achievementAvailable && playerHasFive && !othersHaveFive) {
        return game.aClaimAchievement(player, { name: 'Empire' })
      }
      else {
        game.mLog({ template: 'no effect' })
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