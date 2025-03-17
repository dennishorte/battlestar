const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Plumbing`  // Card names are unique in Innovation
  this.name = `Plumbing`
  this.color = `red`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `&2hk`
  this.dogmaBiscuit = `k`
  this.echo = `Score the bottom blue card from your board.`
  this.karma = []
  this.dogma = [
    `Junk all cards in the 1 deck.`
  ]

  this.dogmaImpl = [
    (game, player) => game.aJunkDeck(player, 1)
  ]
  this.echoImpl = (game, player) => {
    const card = util.array.last(game.getCardsByZone(player, 'blue'))
    if (card) {
      game.aScore(player, card)
    }
    else {
      game.mLogNoEffect()
    }
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
