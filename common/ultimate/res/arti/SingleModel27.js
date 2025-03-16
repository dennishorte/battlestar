const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Single Model 27`  // Card names are unique in Innovation
  this.name = `Single Model 27`
  this.color = `yellow`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `hfii`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a card from your hand. If you do, splay up its color, and then tuck all cards from your score pile of that color.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const tucked = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))
      if (tucked && tucked.length > 0) {
        const color = tucked[0].color
        game.aSplay(player, color, 'up')

        const toTuck = game
          .getCardsByZone(player, 'score')
          .filter(card => card.color === color)
        game.aTuckMany(player, toTuck)
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
