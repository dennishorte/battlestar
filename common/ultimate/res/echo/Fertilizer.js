const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fertilizer`  // Card names are unique in Innovation
  this.name = `Fertilizer`
  this.color = `yellow`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `lhfl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you do, transfer all cards from all score piles to your hand of value equal to the returned card.`,
    `Draw and foreshadow a card of any value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1} )
      if (cards && cards.length > 0) {
        const age = cards[0].getAge()
        const toTransfer = game
          .getPlayerAll()
          .flatMap(player => game
            .getCardsByZone(player, 'score')
            .filter(card => card.getAge() === age)
          )
        game.aTransferMany(player, toTransfer, game.getZoneByPlayer(player, 'hand'))
      }
    },

    (game, player) => {
      const age = game.aChooseAge(player)
      game.aDrawAndForeshadow(player, age)
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
