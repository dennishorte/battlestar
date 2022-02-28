const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Measurement`  // Card names are unique in Innovation
  this.name = `Measurement`
  this.color = `green`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `slsh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may reveal and return a card from your hand. If you do, splay that color of your cards right, and draw a card of value equal to the number of cards of that color on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aChooseCard(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
      if (card) {
        game.mReveal(player, card)
        game.aReturn(player, card)
        game.aSplay(player, card.color, 'right')
        game.aDraw(player, { age: game.getCardsByZone(player, card.color).length })
      }
      else {
        game.mLogDoNothing(player)
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
