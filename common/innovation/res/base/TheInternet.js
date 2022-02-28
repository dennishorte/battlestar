const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Internet`  // Card names are unique in Innovation
  this.name = `The Internet`
  this.color = `purple`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hiis`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your green cards up.`,
    `Draw and score a {0}.`,
    `Draw and meld a {0} for every two {i} on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'up')
    },

    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 10))
    },

    (game, player) => {
      const count = Math.floor(game.getBiscuitsByPlayer(player,).i / 2)
      for (let i = 0; i < count; i++) {
        game.aDrawAndMeld(player, game.getEffectAge(this, 10))
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
