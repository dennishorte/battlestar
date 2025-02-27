const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Socialism`  // Card names are unique in Innovation
  this.name = `Socialism`
  this.color = `purple`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `lhll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may tuck a top card from your board. If you do, tuck all cards from your hand.`,
    `You may junk an available achievement of value 8, 9, or 10.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topCards = game.getTopCards(player)
      const card = game.aChooseCard(player, topCards, {
        title: 'Tuck a top card from your board?',
        min: 0,
      })

      if (card) {
        game.aTuck(player, card)
        game.aTuckMany(player, game.getCardsByZone(player, 'hand'))
      }
    },

    (game, player) => {
      game.aJunkAvailableAchievement(player, [8, 9, 10], { min: 0 })
    },
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
