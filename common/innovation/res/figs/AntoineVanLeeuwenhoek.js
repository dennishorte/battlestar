const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Antoine Van Leeuwenhoek`  // Card names are unique in Innovation
  this.name = `Antoine Van Leeuwenhoek`
  this.color = `yellow`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `&shs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {6}.`
  this.karma = [
    `Each card in hand counts as ten points towards the cost of claiming an achievement of that card's value.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: 6 })
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'achievement-cost-discount',
      func(game, player, { card }) {
        return game
          .getCardsByZone(player, 'hand')
          .filter(other => other.age === card.age)
          .length * 10
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
