const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `X-Ray`  // Card names are unique in Innovation
  this.name = `X-Ray`
  this.color = `blue`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `hl&8`
  this.dogmaBiscuit = `l`
  this.echo = `Draw and tuck an {8}.`
  this.karma = []
  this.dogma = [
    `For every three {l} on your board, draw and foreshadow a card of any value.`,
    `You may splay your yellow cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const leafs = game.getBiscuitsByPlayer(player).l
      const count = Math.floor(leafs / 3)

      for (let i = 0; i < count; i++) {
        const age = game.aChooseAge(player)
        game.aDrawAndForeshadow(player, age)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow'], 'up')
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 8))
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
