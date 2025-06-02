const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Nylon`  // Card names are unique in Innovation
  this.name = `Nylon`
  this.color = `green`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `8ffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck an {8} for every three {f} on your board. If any of the tucked cards were green, repeat this dogma effect.`,
    `You may splay your red cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const count = Math.floor(game.getBiscuitsByPlayer(player).f / 3)
        const tucked = []
        for (let i = 0; i < count; i++) {
          const card = game.aDrawAndTuck(player, game.getEffectAge(this, 8))
          if (card) {
            tucked.push(card)
          }
        }

        if (tucked.some(card => card.color === 'green')) {
          game.log.add({
            template: '{player} tucked at least one green card; repeating.',
            args: { player }
          })
          continue
        }
        else {
          break
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'up')
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
