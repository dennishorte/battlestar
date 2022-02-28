const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Empiricism`  // Card names are unique in Innovation
  this.name = `Empiricism`
  this.color = `purple`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose two colors, then draw and reveal a {9}. If it is either of the colors you chose, meld it and your may splay your cards of that color up.`,
    `If you have twenty or more {s} on your board, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colors = game.aChoose(player, game.utilColors(), { count: 2, title: 'Choose Two Colors' })
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 9))
      if (colors.includes(card.color)) {
        game.aChooseAndSplay(player, [card.color], 'up')
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
        game.mLogNoEffect()
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
