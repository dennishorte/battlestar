const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Carl Friedrich Gauss`  // Card names are unique in Innovation
  this.name = `Carl Friedrich Gauss`
  this.color = `blue`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {7}.`
  this.karma = [
    `If you would meld a card, first choose a value and meld all other cards of that value from your hand and score pile.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 7) })
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        const age = game.aChooseAge(player)
        const hand = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.getAge() === age)
          .filter(other => other !== card)
        const score = game
          .getCardsByZone(player, 'score')
          .filter(card => card.getAge() === age)

        // Use distinct in case some Karma causes overlap in these two zones.
        const cards = util.array.distinct([...hand, ...score])

        if (cards.length === 0) {
          game.mLogNoEffect()
        }
        else {
          game.aMeldMany(player, cards)
        }
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
