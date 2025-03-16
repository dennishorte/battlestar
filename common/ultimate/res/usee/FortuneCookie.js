const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fortune Cookie`  // Card names are unique in Innovation
  this.name = `Fortune Cookie`
  this.color = `purple`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `hllc`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have exactly seven of any icon on your board, draw and score a {7}; exactly eight, splay your green or purple cards right and draw an {8}; exactly nine, draw a {9}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const biscuits = game.getBiscuits()[player.name]

      const exactlySevenIcon = Object.values(biscuits).find(count => count === 7)
      const exactlyEightIcon = Object.values(biscuits).find(count => count === 8)
      const exactlyNineIcon = Object.values(biscuits).find(count => count === 9)

      if (exactlySevenIcon) {
        game.aDrawAndScore(player, game.getEffectAge(this, 7))
      }

      if (exactlyEightIcon) {
        const color = game.aChooseAndSplay(player, ['green', 'purple'], 'right')
        game.aDraw(player, { age: game.getEffectAge(this, 8) })
      }

      if (exactlyNineIcon) {
        game.aDraw(player, { age: game.getEffectAge(this, 9) })
      }

      if (!exactlySevenIcon && !exactlyEightIcon && !exactlyNineIcon) {
        game.mLogNoEffect()
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
