const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bicycle`  // Card names are unique in Innovation
  this.name = `Bicycle`
  this.color = `green`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `ccih`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may exchange all the cards in your hand with all the cards in your score pile. If you exchange one, you must exchange them all.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const decision = game.aYesNo(player, 'Exchange your hand and score pile?')
      if (decision) {
        game.aExchangeZones(
          player,
          game.getZoneByPlayer(player, 'hand'),
          game.getZoneByPlayer(player, 'score'),
        )
      }
      else {
        game.mLogDoNothing(player)
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
