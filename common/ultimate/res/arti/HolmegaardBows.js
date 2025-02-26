const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Holmegaard Bows`  // Card names are unique in Innovation
  this.name = `Holmegaard Bows`
  this.color = `red`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `klhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer the highest top card with a {k} from your board to my hand!`,
    `Draw a {2}`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const topCastles = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      const highest = game.utilHighestCards(topCastles)
      game.aChooseAndTransfer(player, highest, game.getZoneByPlayer(leader, 'hand'))
    },

    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 2) })
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
