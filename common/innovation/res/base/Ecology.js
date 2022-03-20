const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ecology`  // Card names are unique in Innovation
  this.name = `Ecology`
  this.color = `yellow`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `lssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you do, score a card from your hand and draw two {0}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(
        player,
        game.getCardsByZone(player, 'hand'),
        { min: 0, max: 1 }
      )

      if (cards && cards.length > 0) {
        game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
        game.aDraw(player, { age: game.getEffectAge(this, 10) })
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
