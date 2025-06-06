const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Triad`  // Card names are unique in Innovation
  this.name = `Triad`
  this.color = `purple`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `slhs`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have at least three cards in your hand, return a card from your hand and splay the color of the returned card right, tuck a card from your hand, and score a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand')
      if (hand.cards().length >= 3) {
        const returned = game.aChooseAndReturn(player, hand.cards())[0]
        game.aSplay(player, returned.color, 'right')
        game.aChooseAndTuck(player, hand.cards())
        game.aChooseAndScore(player, hand.cards())
      }
      else {
        game.log.addNoEffect()
      }
    },
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
