const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Explosives`  // Card names are unique in Innovation
  this.name = `Explosives`
  this.color = `red`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer the three highest cards from your hand to my hand! If you transferred any, and then have no cards in hand, draw a {7}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const target = game.getZoneByPlayer(leader, 'hand')
      const cards = game.getCardsByZone(player, 'hand')

      const toTransfer = game.aChooseHighest(player, cards, 3)
      const transferred = game.aTransferMany(player, toTransfer, target)

      const transferredCondition = transferred.length > 0
      const emptyHandCondition = game.getCardsByZone(player, 'hand').length === 0
      if (transferredCondition && emptyHandCondition) {
        game.aDraw(player, { age: game.getEffectAge(this, 7) })
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
