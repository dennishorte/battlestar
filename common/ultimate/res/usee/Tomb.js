const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tomb`  // Card names are unique in Innovation
  this.name = `Tomb`
  this.color = `yellow`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `chkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Safeguard an available achievement of value 1 plus the number of achievements you have.`,
    `You may transfer the lowest available achievement to your hand. If you do, return all yellow cards and all blue cards on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const numAchievements = game.getCardsByZone(player, 'achievements').length
      const choices = game
        .getAvailableAchievementsRaw(player)
        .filter(card => card.age === numAchievements + 1)
        .filter(card => card.checkIsStandardAchievement())

      if (choices.length > 0) {
        game.aSafeguard(player, choices[0])
      }
      else {
        game.mLogNoEffect()
      }
    },

    (game, player) => {
      const playerAchievements = game.getCardsByZone(player, 'achievements').length
      const achievements = game
        .getAvailableAchievementsRaw(player)
        .filter(card => card.age === playerAchievements)
        .filter(card => card.checkIsStandardAchievement())

      if (achievements.length === 0) {
        game.mLogNoEffect()
        return
      }

      const lowestAchievement = game.utilLowestCards(achievements)[0]
      const transfer = game.aYesNo(player, `Transfer an achievement of value ${lowestAchievement.getAge()} to your hand?`)

      if (transfer) {
        game.aTransfer(player, lowestAchievement, game.getZoneByPlayer(player, 'hand'))

        const yellowCards = game.getCardsByZone(player, 'yellow')
        const blueCards = game.getCardsByZone(player, 'blue')
        const cardsToReturn = [].concat(yellowCards, blueCards)

        game.aReturnMany(player, cardsToReturn, { ordered: true })
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
