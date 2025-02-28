const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mystery Box`  // Card names are unique in Innovation
  this.name = `Mystery Box`
  this.color = `green`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Claim an available standard achievement, regardless of eligibility. Self-execute it.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game.getAvailableStandardAchievements()
      const achievement = game.aChooseCard(player, choices)

      if (achievement) {
        game.aClaimAchievement(player, achievement)
        game.mLog({
          template: '{player} claimed {achievement}',
          args: { player, achievement }
        })
        
        game.mLog({
          template: '{player} will self-execute {achievement}',
          args: { player, achievement }
        })
        game.aAchievementEffects(player, achievement)
      }
      else {
        game.mLogNoEffect()
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