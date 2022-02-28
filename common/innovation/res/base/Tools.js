const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tools`  // Card names are unique in Innovation
  this.name = `Tools`
  this.color = `blue`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hssk`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return three cards from your hand. If you do, draw and meld a {3}.`,
    `You may return a {3} from your hand. If you do, draw and meld three {1}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.getCardsByZone(player, 'hand')
      if (cards.length >= 3) {
        const doIt = game.aYesNo(player, 'Return three cards to draw and meld a {3}?')
        if (doIt) {
          const returned = game.aChooseAndReturn(player, cards, { count: 3 })
          if (returned.length === 3) {
            game.aDrawAndMeld(player, game.getEffectAge(this, 3))
          }
        }
        else {
          game.mLogDoNothing(player)
        }
      }
      else {
        game.mLogNoEffect()
      }
    },

    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.age === 3)
      const returned = game.aChooseAndReturn(player, choices, { min: 0, max: 1 })
      if (returned && returned.length > 0) {
        game.aDrawAndMeld(player, game.getEffectAge(this, 1))
        game.aDrawAndMeld(player, game.getEffectAge(this, 1))
        game.aDrawAndMeld(player, game.getEffectAge(this, 1))
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
