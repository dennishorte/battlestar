const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pagoda`  // Card names are unique in Innovation
  this.name = `Pagoda`
  this.color = `purple`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `k2hk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {3}. If you have a card of matching color in your hand, tuck the card from your hand and meld the drawn card. Otherwise, foreshadow the drawn card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getCardsByZone(player, 'hand')
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 3))

      if (card) {
        const matching = hand.filter(other => other.color === card.color)
        if (matching.length > 0) {
          game.aChooseAndTuck(player, matching)
          game.aMeld(player, card)
        }
        else {
          game.aForeshadow(player, card)
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
