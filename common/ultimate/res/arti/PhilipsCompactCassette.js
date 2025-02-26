const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Philips Compact Cassette`  // Card names are unique in Innovation
  this.name = `Philips Compact Cassette`
  this.color = `green`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to unsplay all colors on your board!`,
    `Splay up two colors on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      for (const color of game.utilColors()) {
        const zone = game.getZoneByPlayer(player, color)
        if (zone.splay !== 'none') {
          game.aUnsplay(player, zone)
        }
      }
    },

    (game, player) => {
      const colors = game.aChooseAndSplay(player, null, 'up', { count: 2 })
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
