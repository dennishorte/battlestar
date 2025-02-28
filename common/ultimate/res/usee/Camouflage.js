const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Camouflage`  // Card names are unique in Innovation
  this.name = `Camouflage`
  this.color = `red`
  this.age = 7
  this.expansion = `base` 
  this.biscuits = `fhfl`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either tuck exactly two top cards of different colors and equal value on your board, then safeguard them, or score exactly two of your secrets of equal value.`,
    `Draw a {7} for each special achievement you have.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const options = ['Tuck and safeguard', 'Score secrets']
      const choice = game.aChoose(player, options, { title: 'Choose an action' })

      if (choice === 'Tuck and safeguard') {
        const eligibleCards = game
          .getTopCards(player)
          .filter(card => card.age === game.utilColors().find(color => color !== card.color))

        const tuckedCards = game.aChooseCards(player, eligibleCards, { count: 2 })
        if (tuckedCards.length === 2) {
          game.aTuckMany(player, tuckedCards, { zone: 'safeguard' })
        }
        else {
          game.mLogNoEffect()
        }
      } 
      else if (choice === 'Score secrets') {
        const secrets = game.getZoneByPlayer(player, 'secrets').cards()
        const eligibleSecrets = game.utilGroupCardsOfSameValue(secrets).find(group => group.length >= 2)

        if (eligibleSecrets) {
          const scoredSecrets = game.aChooseCards(player, eligibleSecrets, { count: 2 })
          game.aScoreMany(player, scoredSecrets)
        }
        else {
          game.mLogNoEffect()
        }
      }
    },
    (game, player) => {
      const specialAchievements = player.getSpecialAchievementCount()
      game.aDraw(player, { age: game.getEffectAge(this, 7), count: specialAchievements })
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