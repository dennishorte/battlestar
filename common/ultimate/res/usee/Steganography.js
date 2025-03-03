const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Steganography`  // Card names are unique in Innovation
  this.name = `Steganography`
  this.color = `purple`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay left a color on your board with {s}. If you do, safeguard an available achievement of value equal to the number of cards of that color on your board. Otherwise, draw and tuck a {3}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .utilColors()
        .map(color => game.getZoneByPlayer(player, color))
        .filter(zone => game.getBiscuitsByZone(zone).s > 0)
        .map(zone => zone.color)

      const splayed = game.aChooseAndSplay(player, choices, 'left')[0]

      if (splayed) {
        const numCards = game.getCardsByZone(player, splayed).length
        game.aSafeguardAvailableAchievement(player, numCards)
      }
      else {
        game.aDrawAndTuck(player, game.getEffectAge(this, 3))
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
