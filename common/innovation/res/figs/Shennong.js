const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shennong`  // Card names are unique in Innovation
  this.name = `Shennong`
  this.color = `yellow`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `llh*`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw and foreshadow a {2}.`
  this.echo = ``
  this.karma = [
    `If you would foreshadow a card of the same value as a card in your forecast, first score each card of that value in your forecast.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 2))
  }
  this.karmaImpl = [
    {
      trigger: 'foreshadow',
      kind: 'would-first',
      matches: (game, player, { card }) => {
        const forecast = game.getCardsByZone(player, 'forecast')
        return forecast.find(other => other.age === card.age)
      },
      func(game, player, { card }) {
        const toScore = game
          .getCardsByZone(player, 'forecast')
          .filter(other => other.age === card.age)
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
