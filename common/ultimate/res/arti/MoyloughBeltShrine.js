const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Moylough Belt Shrine`  // Card names are unique in Innovation
  this.name = `Moylough Belt Shrine`
  this.color = `yellow`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `klhk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel your to reveal all cards in your hand and transfer the card of my choice to my board.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const cards = game.getCardsByZone(player, 'hand')

      if (cards.length === 0) {
        game.mLog({
          template: '{player} has no cards in hand',
          args: { player }
        })
        return
      }

      for (const card of cards) {
        game.mReveal(player, card)
      }

      const card = game.aChooseCard(leader, cards)
      game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
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
