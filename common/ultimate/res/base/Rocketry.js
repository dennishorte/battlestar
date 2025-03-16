const CardBase = require('../CardBase.js')

function Card() {
  this.id = 'Rocketry'  // Card names are unique in Innovation
  this.name = 'Rocketry'
  this.color = 'blue'
  this.age = 8
  this.expansion = 'base'
  this.biscuits = 'iiih'
  this.dogmaBiscuit = 'i'
  this.echo = ''
  this.karma = []
  this.dogma = [
//    "Return a card in any opponent's score pile for every color on your board with {i}",
    "Choose an opponent. Return a card in that player's score pile for every color on your board with {i}",
  ]

  this.dogmaImpl = [
    (game, player) => {
      const biscuits = game.getBiscuitsByColor(player)
      const count = Object
        .values(biscuits)
        .map(x => x.i)
        .filter(x => x > 0)
        .length

      const opp = game.aChoosePlayer(player, game.getPlayerOpponents(player))
      game.aChooseAndReturn(player, game.getCardsByZone(opp, 'score'), { count })
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, 'constructor', {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
