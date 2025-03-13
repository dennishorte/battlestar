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

        const returned = game.aChooseAndReturn(player, choices)[0]

        if (returned) {
          const age = returned.age
          const secretOptions = game
            .getCardsByZone(player, 'safe')
            .filter(c => c.getAge() === age)

          const secret = game.aChooseCards(player, secretOptions, {
            title: 'Choose a secret to achieve',
            hidden: true,
          })[0]

          if (secret) {
            game.aClaimAchievement(player, secret)
          }

          const standard = game.aChooseCards(player, game.getAvailableStandardAchievements(player), {
            title: 'Choose a standard achievement to safeguard',
            hidden: true
          })[0]

          if (standard) {
            game.aSafeguard(player, standard)
          }

          if (secret && standard) {
            repeatEffect()
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
