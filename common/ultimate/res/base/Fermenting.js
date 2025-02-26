const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fermenting`  // Card names are unique in Innovation
  this.name = `Fermenting`
  this.color = `yellow`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `llhk`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw a {2} for every color on your board with one or more {l}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const count = game
        .utilColors()
        .map(color => game.getZoneByPlayer(player, color))
        .filter(zone => game.getBiscuitsByZone(zone).l > 0)
        .length

      for (let i = 0; i < count; i++) {
        game.aDraw(player, { age: game.getEffectAge(this, 2) })
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
