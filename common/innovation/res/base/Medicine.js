const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Medicine`  // Card names are unique in Innovation
  this.name = `Medicine`
  this.color = `yellow`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `cllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you exchange the highest card in your score pile with the lowest card in my score pile.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const highest = game.utilHighestCards(game.getCardsByZone(player, 'score'))
      const lowest = game.utilLowestCards(game.getCardsByZone(leader, 'score'))

      const highestCards = game.aChooseCards(player, highest)
      const lowestCards = game.aChooseCards(player, lowest)

      if (highestCards && highestCards.length > 0) {
        game.mMoveCardTo(highestCards[0], game.getZoneByPlayer(leader, 'score'), { player })
      }
      if (lowestCards && lowestCards.length > 0) {
        game.mMoveCardTo(lowestCards[0], game.getZoneByPlayer(player, 'score'), { player })
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
