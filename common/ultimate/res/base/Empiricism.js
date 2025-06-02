const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Empiricism`  // Card names are unique in Innovation
  this.name = `Empiricism`
  this.color = `purple`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose two colors, then draw and reveal a {9}. If the drawn card is one of those colors, meld it and splay your cards of that color up, otherwise unsplay that color.`,
    `If you have at least twenty {s} on your board, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colors = game.aChoose(player, game.utilColors(), { count: 2, title: 'Choose Two Colors' })
      game.log.add({
        template: '{player} chooses {color1} and {color2}',
        args: {
          player,
          color1: colors[0],
          color2: colors[1],
        }
      })

      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 9))
      if (colors.includes(card.color)) {
        game.aMeld(player, card)
        game.aSplay(player, card.color, 'up')
      }
      else {
        game.aUnsplay(player, card.color)
      }
    },

    (game, player) => {
      const biscuits = game.getBiscuitsByPlayer(player)
      if (biscuits.s >= 20) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        game.log.addNoEffect()
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
