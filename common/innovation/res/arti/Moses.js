const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Moses`  // Card names are unique in Innovation
  this.name = `Moses`
  this.color = `yellow`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer all top cards with a {c} from your board to my score pile!`,
    `Score a top card with a {c}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const cards = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('c'))
      game.aTransferMany(player, cards, game.getZoneByPlayer(leader, 'score'))
    },

    (game, player) => {
      const choices = game
        .players.all()
        .flatMap(player => game.getTopCards(player))
        .filter(card => card.checkHasBiscuit('c'))
      game.aChooseAndScore(player, choices)
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
