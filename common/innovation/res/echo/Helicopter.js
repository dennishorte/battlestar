const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Helicopter`  // Card names are unique in Innovation
  this.name = `Helicopter`
  this.color = `red`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer a top card other than Helicopter from any player's board to its owner's score pile. You may return a card from your hand which shares an icon with the trasnferred card. If you do, repeat this dogma effect.`
  ]

  this.dogmaImpl = [
    (game, player, { self }) => {
      while (true) {
        const choices = game
          .getPlayerAll()
          .flatMap(player => game.getTopCards(player))
          .filter(c => c !== self)
        const card = game.aChooseCard(player, choices)

        if (card) {
          const owner = game.getPlayerByCard(card)
          game.aTransfer(player, card, game.getZoneByPlayer(owner, 'score'))

          const returnChoices = game
            .getCardsByZone(player, 'hand')
            .filter(c => card.checkSharesBiscuit(c))

          const toReturn = game.aChooseCard(player, returnChoices, { min: 0, max: 1 })
          if (toReturn) {
            game.aReturn(player, toReturn)
            continue
          }
        }

        break
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
