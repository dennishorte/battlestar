const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Camouflage`  // Card names are unique in Innovation
  this.name = `Camouflage`
  this.color = `red`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `fhfl`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either junk exactly two top cards of different colors and equal value on your board, then safeguard them, or score exactly two of your secrets of equal value.`,
    `Draw a {7} for each special achievement you have.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const junkOptions = function() {
        const topCards = game.getTopCards(player)
        const validCards = []
        for (const card of topCards) {
          for (const other of topCards) {
            if (card !== other && card.getAge() === other.getAge()) {
              validCards.push(card)
              break
            }
          }
        }
        return validCards
      }()

      const scoreOptions = function() {
        const secrets = game.getCardsByZone(player, 'safe')
        const validCards = []

        for (const card of secrets) {
          for (const other of secrets) {
            if (card !== other && card.getAge() === other.getAge()) {
              validCards.push(card)
              break
            }
          }
        }
        return validCards
      }()

      const options = []

      if (junkOptions.length > 0) {
        options.push('Junk and safeguard')
      }
      if (scoreOptions.length > 0) {
        options.push('Score secrets')
      }

      const choice = game.actions.choose(player, options, { title: 'Choose an action' })[0]

      if (choice === 'Junk and safeguard') {
        const cards = game.aChooseCards(player, junkOptions, {
          count: 2,
          guard: (cards) => cards.every(c => c.getAge() === cards[0].getAge())
        })
        game.aJunkMany(player, cards)
        game.aSafeguardMany(player, cards)
      }
      else if (choice === 'Score secrets') {
        const cards = game.aChooseCards(player, scoreOptions, {
          count: 2,
          guard: (cards) => cards.every(c => c.getAge() === cards[0].getAge())
        })
        game.aScoreMany(player, cards)
      }
    },
    (game, player) => {
      const specialAchievements = game
        .getCardsByZone(player, 'achievements')
        .filter(a => a.isSpecialAchievement)
        .length

      for (let i = 0; i < specialAchievements; i++) {
        game.aDraw(player, { age: game.getEffectAge(this, 7) })
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
