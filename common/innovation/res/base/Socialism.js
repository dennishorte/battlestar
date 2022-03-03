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
    `You may tuck all cards from your hand. If you tuck one, you must tuck them all. If you tucked at least one purple card, take all the lowest cards in each opponent's hand into your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.getCardsByZone(player, 'hand')
      if (cards.length === 0) {
        game.mLogNoEffect()
      }
      else {
        const tuckThem = game.aYesNo(player, 'Tuck all cards from your hand?')
        if (tuckThem) {
          const tucked = game.aTuckMany(player, cards)

          // If you tucked a purple card...
          if (tucked.find(card => card.color === 'purple')) {
            const accumulator = []
            for (const opp of game.getPlayerOpponents(player)) {
              const hand = game
                .getCardsByZone(opp, 'hand')
                .sort((l, r) => l.age - r.age)
              util
                .array
                .takeWhile(hand, card => card.age === hand[0].age)
                .forEach(card => accumulator.push(card))
            }
            game.aTransferMany(player, accumulator, game.getZoneByPlayer(player, 'hand'))
          }
        }
        else {
          game.mLogDoNothing(player)
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
