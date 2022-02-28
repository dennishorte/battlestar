const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Anatomy`  // Card names are unique in Innovation
  this.name = `Anatomy`
  this.color = `yellow`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a card from your score pile! If you do, return a top card of equal value from your board!`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getZoneByPlayer(player, 'score').cards())
      if (cards.length > 0) {
        const returned = cards[0]
        const matchingTopCards = game
          .getTopCards(player)
          .filter(card => card.age === returned.age)
        game.aChooseAndReturn(player, matchingTopCards)
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
