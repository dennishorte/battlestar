const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Glassblowing`  // Card names are unique in Innovation
  this.name = `Glassblowing`
  this.color = `green`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `hcc&`
  this.dogmaBiscuit = `c`
  this.echo = `Score an expansion card from your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a card of value three higher than the lowest non-green top card on your board.`,
    `Choose the {2} or {3} deck. Junk all cards in that deck.`
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
    },

    (game, player) => {
      game.aChooseAndJunkDeck(player, [game.getEffectAge(this, 2), game.getEffectAge(this, 3)])
    },
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getCardsByZone(player, 'hand')
      .filter(card => card.checkIsExpansion())
    game.aChooseAndScore(player, choices)
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
