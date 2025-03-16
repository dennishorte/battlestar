const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shennong`  // Card names are unique in Innovation
  this.name = `Shennong`
  this.color = `yellow`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `llh*`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = [
    `If you would foreshadow a card of the same value as a card in your forecast, first score each card of that value in your forecast.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.karmaImpl = [
    {
      trigger: 'foreshadow',
      kind: 'would-first',
      matches: (game, player, { card }) => {
        const forecast = game.getCardsByZone(player, 'forecast')
        return forecast.find(other => other.getAge() === card.getAge())
      },
      func(game, player, { card }) {
        const toScore = game
          .getCardsByZone(player, 'forecast')
          .filter(other => other.getAge() === card.getAge())
        game.aScoreMany(player, toScore)
      },
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
