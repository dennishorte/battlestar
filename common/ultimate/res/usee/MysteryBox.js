const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mystery Box`  // Card names are unique in Innovation
  this.name = `Mystery Box`
  this.color = `green`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Claim an available standard achievement, regardless of eligibility. Self-execute it.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game.getAvailableStandardAchievements(player)
      const achievement = game.actions.chooseCards(player, choices, {
        title: 'Choose a standard achievement to claim',
        hidden: true,
      })[0]

      if (achievement) {
        game.aClaimAchievement(player, achievement)
        game.mReveal(player, achievement)
        game.aSelfExecute(player, achievement)
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
