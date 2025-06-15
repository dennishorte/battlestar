const CardBase = require(`../CardBase.js`)

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
      const returnCard = game.actions.chooseYesNo(player, 'Return the highest card from your score pile?')
      if (returnCard) {
        const highestCards = game.utilHighestCards(game.getCardsByZone(player, 'score'))
        const cards = game.aChooseAndReturn(player, highestCards)

        if (cards.length > 0) {
          const newHighest = game.utilHighestCards(game.getCardsByZone(player, 'score'))
          const age = newHighest.length > 0 ? newHighest[0].getAge() + 2 : 2
          game.aDraw(player, { age })
        }
      }
      else {
        game.log.addDoNothing(player)
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
