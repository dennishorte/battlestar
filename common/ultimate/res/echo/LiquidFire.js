const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Liquid Fire`  // Card names are unique in Innovation
  this.name = `Liquid Fire`
  this.color = `red`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal a card of value equal to the highest bonus on your board! Transfer it to my forecast! If it is red, transfer all cards from your hand to my score pile.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const age = Math.max(...game.getBonuses(player))
      if (age && age > 0) {
        const card = game.aDrawAndReveal(player, age)
        if (card) {
          game.aTransfer(player, card, game.getZoneByPlayer(leader, 'forecast'))

          if (card.color === 'red') {
            game.aTransferMany(player, game.getCardsByZone(player, 'hand'), game.getZoneByPlayer(leader, 'score'))
          }
        }
      }
      else {
        game.mLog({
          template: '{player} has no bonuses',
          args: { player }
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
