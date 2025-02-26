const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Glassblowing`  // Card names are unique in Innovation
  this.name = `Glassblowing`
  this.color = `green`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `hcc&`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Score a card with a bonus from your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a card of value three higher than the lowest non-green top card on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topCards = game
        .getTopCards(player)
        .filter(card => card.color !== 'green')
      const lowest = game.utilLowestCards(topCards)

      if (lowest.length === 0) {
        game.aDrawAndForeshadow(player, 3)
      }
      else {
        game.aDrawAndForeshadow(player, lowest[0].getAge() + 3)
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getCardsByZone(player, 'hand')
      .filter(card => card.checkHasBonus())
    game.aChooseAndScore(player, choices)
  }
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
