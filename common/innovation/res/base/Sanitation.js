const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sanitation`  // Card names are unique in Innovation
  this.name = `Sanitation`
  this.color = `yellow`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you exchange the two highest cards in your hand with the lowest card in my hand!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const highest = game.aChooseHighest(player, game.getCardsByZone(player, 'hand'), 2)
      const lowest = game.aChooseLowest(leader, game.getCardsByZone(leader, 'hand'), 1)

      game.mMoveCardsTo(player, highest, game.getZoneByPlayer(leader, 'hand'))
      game.mMoveCardsTo(player, lowest, game.getZoneByPlayer(player, 'hand'))
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
