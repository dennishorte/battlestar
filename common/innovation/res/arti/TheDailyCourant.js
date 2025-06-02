const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Daily Courant`  // Card names are unique in Innovation
  this.name = `The Daily Courant`
  this.color = `yellow`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `ffch`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw a card of any value, then place it on top of the draw pile of its age. Execute the effects of one of your other top cards as if they were on this card. Do not share them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const age = game.aChooseAge(player)
      game.log.add({
        template: '{player} choose age {age}',
        args: { player, age }
      })
      const card = game.aDraw(player, { age })
      if (card) {
        game.mMoveCardToTop(card, game.getZoneByCardHome(card))
        game.log.add({
          template: '{player} puts {card} on back on top of deck',
          args: { player, card }
        })
      }

      const choices = game.getTopCards(player)
      const toExecute = game.aChooseCard(player, choices)
      if (toExecute) {
        game.log.add({
          template: '{player} executes {card}',
          args: {
            player,
            card: toExecute
          }
        })
        game.aExecuteAsIf(player, toExecute)
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
