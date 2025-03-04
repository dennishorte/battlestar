const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Quantum Computers`  // Card names are unique in Innovation
  this.name = `Quantum Computers`
  this.color = `blue` 
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `iihi`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I DEMAND you flip a coin! If you lose the flip, you lose!`,
    `Flip a coin. If you win the flip, this effect is complete. If you lose the flip, return one of your secrets. If you don't, you lose. Otherwise, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const result = game.aChoose(player, ['heads', 'tails'], {
        title: 'Flip a coin',
      })
      
      if (result === 'tails') {
        game.mLog({
          template: '{player} loses the coin flip and the game!',
          args: { player },
        })
        game.aLoseGame(player)
      }
    },

    (game, player) => {
      while (true) {
        const result = game.aChoose(player, ['heads', 'tails'], {
          title: 'Flip a coin',
        })

        if (result === 'heads') {
          game.mLog({
            template: '{player} wins the coin flip and the effect ends.',
            args: { player },
          })
          break
        }

        const secrets = game.getCardsByZone(player, 'score')
        const returned = game.aChooseAndReturn(player, secrets, {
          min: secrets.length === 0 ? 0 : 1,
          max: 1,
          title: 'Return a secret',
        })

        if (returned.length === 0) {
          game.mLog({
            template: '{player} has no secrets to return and loses the game!', 
            args: { player },
          })
          game.aLoseGame(player)
          break
        }
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