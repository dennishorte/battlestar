const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Industrialization`  // Card names are unique in Innovation
  this.name = `Industrialization`
  this.color = `red`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `cffh`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck three {6}. Then, if you are the single player with the most {i}, return your top red card.`,
    `You may splay your red or purple cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      for (let i = 0; i < 3; i++) {
        game.aDrawAndTuck(player, game.getEffectAge(this, 6))
      }

      const playerWithMost = game.getUniquePlayerWithMostBiscuits('i')
      if (playerWithMost && playerWithMost.name === player.name) {
        const card = game.getTopCard(player, 'red')
        if (card) {
          game.aReturn(player, card)
        }
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'purple'], 'right')
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
