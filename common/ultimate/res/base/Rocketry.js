const CardBase = require('../CardBase.js')

function Card() {
  this.id = 'Rocketry'  // Card names are unique in Innovation
  this.name = 'Rocketry'
  this.color = 'blue'
  this.age = 8
  this.expansion = 'base'
  this.biscuits = 'iiih'
  this.dogmaBiscuit = 'i'
  this.inspire = ''
  this.echo = ''
  this.karma = []
  this.dogma = [
    //"Return a card in any opponent's score pile for every two {i} on your board."
    "Choose an opponent. Return a card from that player's score pile for every two {i} on your board."
  ]

  this.dogmaImpl = [
    (game, player) => {
      const count = Math.floor(game.getBiscuitsByPlayer(player).i / 2)
      const opp = game.aChoosePlayer(player, game.getPlayerOpponents(player))
      game.aChooseAndReturn(player, game.getCardsByZone(opp, 'score'), { count })
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, 'constructor', {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
