const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Emancipation`  // Card names are unique in Innovation
  this.name = `Emancipation`
  this.color = `purple`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `fsfh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card from your hand to my score pile! If you do, draw a {6}.`,
    `You may splay your red or purple cards right.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const cards = game.aChooseAndTransfer(
        player,
        game.getCardsByZone(player, 'hand'),
        game.getZoneByPlayer(leader, 'score')
      )
      if (cards && cards.length > 0) {
        game.aDraw(player, { age: game.getEffectAge(this, 6) })
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'purple'], 'right')
    },
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
