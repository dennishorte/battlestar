const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Democracy`  // Card names are unique in Innovation
  this.name = `Democracy`
  this.color = `purple`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `cssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return any number of cards from your hand. If you have teturned more cards than any opponent due to Democracy so far during this dogma action, draw and score an {8}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (!game.state.dogmaInfo.democracyMaxReturned) {
        game.state.dogmaInfo.democracyMaxReturned = 0
      }
      const hand = game.getCardsByZone(player, 'hand')
      const cards = game.aChooseAndReturn(player, hand, { min: 0, max: hand.length })

      if (cards.length > game.state.dogmaInfo.democracyMaxReturned) {
        game.aDrawAndScore(player, game.getEffectAge(this, 8))
        game.state.dogmaInfo.democracyMaxReturned = cards.length
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
