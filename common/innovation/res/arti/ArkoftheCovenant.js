const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ark of the Covenant`  // Card names are unique in Innovation
  this.name = `Ark of the Covenant`
  this.color = `purple`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Transfer all cards of the same color from the boards of all players with no top Artifacts to your score pile. If Ark of the Covenant is a top card on any board, transfer it to your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const color = cards[0].color

        const toTransfer = game
          .players.all()
          .filter(player => game.getTopCards(player).every(card => !card.checkIsArtifact()))
          .flatMap(player => game.getCardsByZone(player, color))

        game.aTransferMany(player, toTransfer, game.getZoneByPlayer(player, 'score'), { ordered: true })
      }

      const ark = game.getCardByName('Ark of the Covenant')
      if (game.checkCardIsTop(ark)) {
        game.aTransfer(player, ark, game.getZoneByPlayer(player, 'hand'))
      }
      else {
        game.log.add({
          template: 'Ark of the Covenant is not a top card',
        })
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
