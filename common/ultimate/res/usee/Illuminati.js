const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Illuminati`  // Card names are unique in Innovation
  this.name = `Illuminati`
  this.color = `purple`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal a card in your hand. Splay the card's color on your board right. Safeguard the top card on your board of that color. Safeguard an available achievement of value one higher than the secret.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand').cards()
      const card = game.aChooseAndReveal(player, hand)[0]

      if (card) {
        game.aSplay(player, card.color, 'right')

        const topCard = game.getTopCard(player, card.color)
        const safeGuarded = game.aSafeguard(player, topCard)

        const availableAchievements = game.getAvailableStandardAchievements(player)
        const higherAchievement = availableAchievements.find(a => a.getAge() === safeGuarded.getAge() + 1)

        if (higherAchievement) {
          game.aSafeguard(player, higherAchievement)
        }
        else {
          game.mLog({
            template: 'No available achievement of value {age} to safeguard',
            args: { age: card.getAge() + 1 }
          })
        }
      }
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
