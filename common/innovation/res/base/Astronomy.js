const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Astronomy`  // Card names are unique in Innovation
  this.name = `Astronomy`
  this.color = `purple`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `cssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {6}. If the card is green or blue, meld it and repeat this dogma effect.`,
    `If all non-purple top cards on your board are value {6} or higher, claim the Universe achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
        if (card) {
          if (card.color === 'green' || card.color === 'blue') {
            game.aMeld(player, card)
            game.mLog({ template: 'dogma effect repeats' })
          }
          else {
            break
          }
        }
      }
    },

    (game, player) => {
      const conditionMet = game
        .utilColors()
        .filter(color => color !== 'purple')
        .map(color => game.getTopCard(player, color))
        .filter(card => card !== undefined)
        .every(card => card.age >= 6)

      if (conditionMet) {
        game.aClaimAchievement(player, { name: 'Universe' })
      }
      else {
        game.mLogNoEffect()
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
