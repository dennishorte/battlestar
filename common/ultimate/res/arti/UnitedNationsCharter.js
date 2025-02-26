const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `United Nations Charter`  // Card names are unique in Innovation
  this.name = `United Nations Charter`
  this.color = `red`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `hlil`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer all top cards on your board with a demand effect to my score pile!`,
    `If you have a top card on your board with a demand effect, draw a {0}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const toTransfer = game
        .getTopCards(player)
        .filter(card => card.checkHasDemand())
      game.aTransferMany(player, toTransfer, game.getZoneByPlayer(leader, 'score'))
    },

    (game, player) => {
      const matches = game
        .getTopCards(player)
        .filter(card => card.checkHasDemand())
        .length > 0

      if (matches) {
        game.aDraw(player, { age: game.getEffectAge(this, 10) })
      }
      else {
        game.mLogNoEffect()
      }
    },
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
