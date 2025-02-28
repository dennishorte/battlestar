const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Red Herring`  // Card names are unique in Innovation
  this.name = `Red Herring`
  this.color = `red`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `chcc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Splay your red cards left, right, or up.`,
    `Draw and tuck a {6}. If the color on your board of the card you tuck is splayed in the same direction as your red cards, splay that color up. Otherwise, unsplay that color.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['red'], null) 
    },
    (game, player) => {
      const card = game.aDrawAndTuck(player, game.getEffectAge(this, 6))
      if (card) {
        const redSplay = game.getZoneByPlayer(player, 'red').splay
        const cardSplay = game.getZoneByPlayer(player, card.color).splay
        if (redSplay === cardSplay) {
          game.aSplay(player, card.color, 'up')
        } else {
          game.aSplay(player, card.color, 'none')
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