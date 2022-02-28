const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Industrialization`  // Card names are unique in Innovation
  this.name = `Industrialization`
  this.color = `red`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `cffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck a {6} for every color on your board with one or more {f}.`,
    `You may splay your red or purple cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const factoryBiscuits = game.getBiscuitsByPlayer(player).f
      const numTucks = Math.floor(factoryBiscuits / 2)
      for (let i = 0; i < numTucks; i++) {
        game.aDrawAndTuck(player, game.getEffectAge(this, 6))
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'purple'], 'right')
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
