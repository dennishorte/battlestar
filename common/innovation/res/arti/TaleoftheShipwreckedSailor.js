const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tale of the Shipwrecked Sailor`  // Card names are unique in Innovation
  this.name = `Tale of the Shipwrecked Sailor`
  this.color = `purple`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hkss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color. Draw a {1}. Meld a card of the chosen color from your hand. If you do, splay that color left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colors = game.aChoose(player, game.utilColors(), { title: 'Choose a Color ' })
      game.aDraw(player, { age: game.getEffectAge(this, 1) })
      if (colors && colors.length > 0) {
        const color = colors[0]
        const choices = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.color === color)
        const melded = game.aChooseAndMeld(player, choices)
        if (melded && melded.length > 0) {
          game.aSplay(player, color, 'left')
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
