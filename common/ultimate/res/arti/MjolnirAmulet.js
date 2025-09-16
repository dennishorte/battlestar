const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mjolnir Amulet`  // Card names are unique in Innovation
  this.name = `Mjolnir Amulet`
  this.color = `red`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `hkks`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to choose a top card on your board! Transfer all cards of the card's color from your board to my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const card = game.aChooseCard(player, game.getTopCards(player))
      if (card) {
        game.aTransferMany(
          player,
          game.getCardsByZone(player, card.color),
          game.getZoneByPlayer(leader, 'score'),
          { ordered: true },
        )
      }
      else {
        game.mLog({
          template: '{player} chooses nothing',
          args: { player }
        })
      }
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
