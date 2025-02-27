const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Miniaturization`  // Card names are unique in Innovation
  this.name = `Miniaturization`
  this.color = `red`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hsis`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. If you returned a {0}, draw a {0} for every different value of card in your score pile. If you return an {b}, junk all cards in the {b} deck.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), { min: 1, max: 1 })
      if (cards && cards.length > 0) {
        const card = cards[0]
        if (card.getAge() === game.getEffectAge(this, 10)) {
          const allAges = game
            .getCardsByZone(player, 'score')
            .map(card => card.getAge())
          const distinctAges = util.array.distinct(allAges)
          for (let i = 0; i < distinctAges.length; i++) {
            game.aDraw(player, { age: game.getEffectAge(this, 10) })
          }
        }
        else if (card.getAge() === game.getEffectAge(this, 11)) {
          game.aJunkDeck(player, game.getEffectAge(this, 11))
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
