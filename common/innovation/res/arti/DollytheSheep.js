const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Dolly the Sheep`  // Card names are unique in Innovation
  this.name = `Dolly the Sheep`
  this.color = `yellow`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `hili`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may score your bottom yellow card. You may draw and tuck a {1}. If your bottom yellow card is Domestication, you win. Otherwise, meld the higest card in your hand, then draw a {0}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      // You may score your bottom yellow card.
      const yellowCards = game.getCardsByZone(player, 'yellow')
      if (yellowCards.length === 0) {
        game.mLog({
          template: '{player} has no yellow cards',
          args: { player },
        })
      }
      else {
        const doScoreYellow = game.aYesNo(player, 'Score your bottom yellow card?')
        if (doScoreYellow) {
          game.aScore(player, yellowCards[yellowCards.length - 1])
        }
        else {
          game.mLog({
            template: '{player} chooses not to score their bottom yellow card.',
            args: { player }
          })
        }
      }

      // You may draw and tuck a 1.
      const age = game.getEffectAge(this, 1)
      const doDrawAndTuck = game.aYesNo(player, `Draw and tuck a {${age}}?`)
      if (doDrawAndTuck) {
        game.aDrawAndTuck(player, age)
      }

      // You win if your bottom yellow card is domestication.
      const newYellowCards = game.getCardsByZone(player, 'yellow')
      if (newYellowCards.length > 0 && newYellowCards[newYellowCards.length - 1].name === 'Domestication') {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }

      // Otherwise, meld the highest card in your hand and draw a 10.
      else {
        const cards = game.aChooseHighest(player, game.getCardsByZone(player, 'hand'), 1)
        if (cards && cards.length > 0) {
          game.aMeld(player, cards[0])
        }

        game.aDraw(player, { age: game.getEffectAge(this, 10) })
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
