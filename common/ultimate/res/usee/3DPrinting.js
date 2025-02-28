const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `3D Printing`  
  this.name = `3D Printing`
  this.color = `purple`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `siih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a top or bottom card on your board. Achieve one of your secrets of value equal to the returned card regardless of eligibility, then safeguard an available standard achievement. If you do, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const repeatEffect = () => {
        const topCards = game.getTopCards(player)
        const bottomCards = game.getBottomCards(player)
        const choices = topCards.concat(bottomCards)

        const returned = game.aChooseAndReturn(player, choices, { min: 0, max: 1 })

        if (returned.length > 0) {
          const age = returned[0].age
          const secret = game.aChooseCard(player, game.getSecretsByAge(player, age), { min: 0, max: 1 })

          if (secret) {
            game.aAchieveSecret(player, secret)

            const standard = game.aChooseAvailableStandardAchievement(player)
            if (standard) {
              game.aSafeguardAchievement(player, standard)
              repeatEffect()  // Repeat the effect
            }
          }
        }
      }

      repeatEffect() // Start the repeating effect
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