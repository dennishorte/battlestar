const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Freemasons`  // Card names are unique in Innovation
  this.name = `Freemasons`
  this.color = `yellow`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `chck`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each color, you may tuck a card from your hand of that color. If you tuck any yellow or expansion cards, draw two {3}.`,
    `You may splay your yellow or blue cards left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const tucked = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'), {
        title: 'Choose up to one card of each color',
        min: 0,
        max: 5,
        guard: (cards) => util.array.isDistinct(cards.map(c => c.color)),
      })

      const tuckedYellow = tucked.some(c => c.color === 'yellow')
      const tuckedExpansion = tucked.some(c => c.expansion !== 'base')

      if (tuckedYellow || tuckedExpansion) {
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'blue'], 'left')
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
