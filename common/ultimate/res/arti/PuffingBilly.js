const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Puffing Billy`  // Card names are unique in Innovation
  this.name = `Puffing Billy`
  this.color = `blue`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Draw a card of value equal to the highest number of symbols of the same type visible in that color on your board. Splay right that color.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const returned = cards[0]
        const biscuits = game.getBiscuitsByZone(game.getZoneByPlayer(player, returned.color))
        const sorted = Object
          .entries(biscuits)
          .sort((l, r) => r[1] - l[1])
        const count = sorted[0][1]
        game.aDraw(player, { age: count })
        game.aSplay(player, returned.color, 'right')
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
