const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Toothbrush`  // Card names are unique in Innovation
  this.name = `Toothbrush`
  this.color = `yellow`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `2&hl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Tuck all cards of one present value from your hand.`
  this.karma = []
  this.dogma = [
    `You may splay any one color of your cards left.`,
    `If the {2} deck has at least one card, you may transfer its bottom card to the available achievements.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, null, 'left')
    },

    (game, player) => {
      const deckAge = game.getEffectAge(this, 2)
      const deck = game.getZoneByDeck('base', deckAge).cards()
      if (deck.length > 0) {
        const doTransfer = game.aYesNo(player, `Transfer the bottom {${deckAge}} to the available achievements?`)
        if (doTransfer) {
          game.aTransfer(player, deck[0], game.getZoneById('achievements'))
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const ages = game
      .getCardsByZone(player, 'hand')
      .map(card => card.getAge())
      .sort()
    const choices = util.array.distinct(ages)
    const age = game.aChooseAge(player, choices)
    if (age) {
      const toTuck = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() === age)
      game.aTuckMany(player, toTuck)
    }
  }
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
