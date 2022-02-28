const CardBase = require(`../CardBase.js`)
const util = require('../../util.js')

function Card() {
  this.id = `Education`  // Card names are unique in Innovation
  this.name = `Education`
  this.color = `purple`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return the highest card from your score pile. If you do, draw a card of value two higher than the highest card remaining in your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returnCard = game.aYesNo(player, 'Return the highest card from your score pile?')
      if (returnCard) {
        const sortedCards = game
          .getCardsByZone(player, 'score')
          .sort((l, r) => r.age - l.age)
        const highestCards = util.array.takeWhile(sortedCards, card => card.age === sortedCards[0].age)
        const cards = game.aChooseAndReturn(player, highestCards)

        if (cards.length > 0) {
          const sortedAgain = game
            .getCardsByZone(player, 'score')
            .sort((l, r) => r.age - l.age)

          if (cards.length === 0) {
            game.mLogNoEffect()
          }
          else {
            game.aDraw(player, { age: sortedAgain[0].age + 2 })
          }
        }
      }
      else {
        game.mLogDoNothing(player)
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
