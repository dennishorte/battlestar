const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Garland's Ruby Slippers`  // Card names are unique in Innovation
  this.name = `Garland's Ruby Slippers`
  this.color = `purple`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld an {8} from your hand. If the melded card has no effects, you win. Otherwise, execute the effects of the melded card as if they were on this card. Do not share them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() === game.getEffectAge(this, 8))
      const cards = game.aChooseAndMeld(player, choices)

      if (cards && cards.length > 0) {
        const card = cards[0]
        if (
          card.dogma.length === 0
          && card.echo.length === 0

          // Do these count as effects for the purpose of this card?
          // && card.inspire.length === 0
          // && card.karma.length === 0
        ) {
          throw new GameOverEvent({
            player,
            reason: this.name
          })
        }

        else {
          game.aExecuteAsIf(player, card)
        }
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
