const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Satellites`  // Card names are unique in Innovation
  this.name = `Satellites`
  this.color = `green`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand, and draw three {8}.`,
    `You may splay your purple cards up.`,
    `Meld a card from your hand and then self-execute it.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(this, 8) })
      game.aDraw(player, { age: game.getEffectAge(this, 8) })
      game.aDraw(player, { age: game.getEffectAge(this, 8) })
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
    },
    (game, player) => {
      const cards = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        game.aSelfExecute(player, cards[0])
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
