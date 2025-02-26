const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Metric System`  // Card names are unique in Innovation
  this.name = `Metric System`
  this.color = `green`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `hfcc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If your green cards are splayed right, you may splay any one color of your cards right.`,
    `You may splay your green cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (game.getZoneByPlayer(player, 'green').splay === 'right') {
        game.aChooseAndSplay(player, null, 'right')
      }
      else {
        game.mLogNoEffect()
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'right')
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
