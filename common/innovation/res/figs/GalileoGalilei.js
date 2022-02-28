const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Galileo Galilei`  // Card names are unique in Innovation
  this.name = `Galileo Galilei`
  this.color = `green`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `hcc&`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {5} or {6}.`
  this.karma = [
    `If you would foreshadow a card of value not present in your forecast, first transfer all cards from your forecast into your hand.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const age = game.aChooseAge(player, [
      game.getEffectAge(this, 5),
      game.getEffectAge(this, 6)
    ])
    game.aDrawAndForeshadow(player, age)
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'foreshadow',
      kind: 'would-first',
      matches: (game, player, { card }) => {
        const forecastCards = game.getCardsByZone(player, 'forecast')
        const matchedAge = forecastCards.find(c => c.age === card.age)
        return matchedAge === undefined
      },
      func: (game, player) => {
        game.aTransferMany(
          player,
          game.getCardsByZone(player, 'forecast'),
          game.getZoneByPlayer(player, 'hand')
        )
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
