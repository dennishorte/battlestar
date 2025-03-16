const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Statistics`  // Card names are unique in Innovation
  this.name = `Statistics`
  this.color = `yellow`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `lslh`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all the cards of the value of my choice in your score pile to your hand.`,
    `You may splay your yellow cards right.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const ages = game
        .getCardsByZone(player, 'score')
        .map(card => card.getAge())
      const options = util.array.distinct(ages).sort()

      const value = game.aChooseAge(leader, options, { title: 'Age to transfer from score to hand' })

      if (value) {
        const cards = game
          .getCardsByZone(player, 'score')
          .filter(card => card.getAge() === value)
        game.aTransferMany(player, cards, game.getZoneByPlayer(player, 'hand'), { ordered: true })
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow'], 'right')
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
