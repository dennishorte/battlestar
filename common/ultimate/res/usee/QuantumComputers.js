const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Quantum Computers`  // Card names are unique in Innovation
  this.name = `Quantum Computers`
  this.color = `blue`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `iihi`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you flip a coin! If you lose the flip, you lose!`,
    // `Flip a coin. If you win the flip, this effect is complete. If you lose the flip, return one of your secrets. If you don't, you lose. Otherwise, repeat this effect.`
    `Flip a coin until you win the flip. Each time you lose a flip during this effect, return a secret or lose the game.`
  ]

  this.dogmaImpl = [
    (game, player, { self }) => {
      const lose = !game.aFlipCoin(player)
      if (lose) {
        game.aYouLose(player, self)
      }
    },

    (game, player, { self }) => {
      while (true) {
        if (game.aFlipCoin(player)) {
          game.mLog({
            template: '{player} wins the coin flip and the effect ends.',
            args: { player },
          })
          break
        }

        const secrets = game.getCardsByZone(player, 'safe')
        const returned = game.aChooseAndReturn(player, secrets, {
          title: 'Return a secret',
        })

        if (returned.length === 0) {
          game.mLog({
            template: '{player} has no secrets to return and loses the game!',
            args: { player },
          })
          game.aYouLose(player, self)
          break
        }
      }
    }
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
