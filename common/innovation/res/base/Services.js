const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Services`  // Card names are unique in Innovation
  this.name = `Services`
  this.color = `purple`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all the highest cards from your score pile to my hand! If you transferred any cards, then transfer a top card from my board without a {l} to your hand.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const highest = game.utilHighestCards(game.getCardsByZone(player, 'score'))
      const transferred = game.aTransferMany(player, highest, game.getZoneByPlayer(leader, 'hand'))
      if (transferred && transferred.length > 0) {
        const choices = game
          .getTopCards(leader)
          .filter(card => !card.checkHasBiscuit('l'))
        game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(player, 'hand'))
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
