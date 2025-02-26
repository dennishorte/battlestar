const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `DeLorean DMC-12`  // Card names are unique in Innovation
  this.name = `DeLorean DMC-12`
  this.color = `purple`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If DeLorean DMC-12 is a top card on any board, remove all top cards on all boards and all cards in all hands from the game.`
  ]

  this.dogmaImpl = [
    (game, player, { self }) => {
      if (game.checkCardIsTop(self) && !this.zone.endsWith('.artifact')) {
        const topCards = game
          .getPlayerAll()
          .flatMap(player => game.getTopCards(player))
        game.aRemoveMany(player, topCards)

        const hands = game
          .getPlayerAll()
          .flatMap(player => game.getCardsByZone(player, 'hand'))
        game.aRemoveMany(player, hands, { ordered: true })
      }
      else {
        game.mLogNoEffect()
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
