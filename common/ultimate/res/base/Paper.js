const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Paper`  // Card names are unique in Innovation
  this.name = `Paper`
  this.color = `green`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `hssc`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your green or blue cards left.`,
    `Draw a {4} for every color you have splayed left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['green', 'blue'], 'left')
    },

    (game, player) => {
      const splayedLeftCount = game
        .utilColors()
        .map(color => game.getZoneByPlayer(player, color))
        .filter(zone => zone.splay === 'left')
        .length

      for (let i = 0; i < splayedLeftCount; i++) {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
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
