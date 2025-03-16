const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pressure Cooker`  // Card names are unique in Innovation
  this.name = `Pressure Cooker`
  this.color = `yellow`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `5hss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. For each top card on your board with a bonus, draw a card of value equal to that bonus.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))

      const toDraw = game
        .getTopCards(player)
        .filter(card => card.checkHasBonus())
        .map(card => card.getBonuses()[0])
        .sort()

      while (toDraw.length > 0) {
        const age = game.aChooseAge(player, toDraw)
        game.aDraw(player, { age })
        toDraw.splice(toDraw.indexOf(age), 1)
      }
    }
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
