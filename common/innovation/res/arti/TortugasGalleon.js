const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tortugas Galleon`  // Card names are unique in Innovation
  this.name = `Tortugas Galleon`
  this.color = `red`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `ffch`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer all the highest cards from your score pile to my score pile! If you transfered any, transfer a top card on your board of that value to my board.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const highest = game.utilHighestCards(game.getCardsByZone(player, 'score'))
      const transferred = game.aTransferMany(player, highest, game.getZoneByPlayer(leader, 'score'))
      if (transferred && transferred.length > 0) {
        const age = transferred[0].getAge()
        const choices = game
          .getTopCards(player)
          .filter(card => card.getAge() === age)
        const card = game.actions.chooseCard(player, choices)
        if (card) {
          game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
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
