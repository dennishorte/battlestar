const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Cliffhanger`  // Card names are unique in Innovation
  this.name = `Cliffhanger`
  this.color = `green`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `sllh`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal a {4} in your safe. If it is: green, tuck it; purple, meld it; red, achieve it regardless of eligibility; yellow, score it; blue, draw a {5}. Otherwise, safeguard the top card of the {4} deck.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'safe')
        .filter(card => card.age === 4)

      if (choices.length === 0) {
        const age = game.getEffectAge(this, 4)
        game.mLog({
          template: 'No cards of age {4} in safe; safeguarding top of {age} pile',
          args: { age }
        })

        const topCard = game.getZoneByDeck('base', 4).cards()[0]

        if (topCard) {
          game.aSafeguard(player, topCard)
        }
        else {
          game.mLog({ template: 'No cards in the 4 deck. (This is not a draw action.)' })
        }
        return
      }

      const card = util.array.select(choices)
      game.mReveal(player, card)

      switch (card.color) {
        case 'green':
          game.aTuck(player, card)
          break
        case 'purple':
          game.aMeld(player, card)
          break
        case 'red':
          game.aClaimAchievement(player, card)
          break
        case 'yellow':
          game.aScore(player, card)
          break
        case 'blue':
          game.aDraw(player, { age: game.getEffectAge(this, 5) })
          break
        default:
          break
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
