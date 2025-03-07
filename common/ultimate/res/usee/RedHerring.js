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
      const red = game.getZoneByPlayer(player, 'red')

      if (red.cards().length < 2) {
        game.mLog({ template: 'Red cannot be splayed' })
        return
      }

      const choices = ['left', 'right', 'up'].filter(x => x !== red.splay)

      const direction = game.aChoose(player, choices, {
        title: 'Choose a direction to splay red',
      })[0]
      game.aSplay(player, 'red', direction)
    },
    (game, player) => {
      const card = game.aDrawAndTuck(player, game.getEffectAge(this, 6))
      if (card) {
        const redSplay = game.getZoneByPlayer(player, 'red').splay
        const cardSplay = game.getZoneByPlayer(player, card.color).splay
        if (redSplay === cardSplay) {
          game.aSplay(player, card.color, 'up')
        }
        else {
          game.aUnsplay(player, card.color)
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
