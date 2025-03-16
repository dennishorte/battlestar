const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Moonlight Sonata`  // Card names are unique in Innovation
  this.name = `Moonlight Sonata`
  this.color = `purple`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    // `Choose a color on your board having the highest top card. Meld the bottom card on your board of that color. Claim an achievement, ignoring eligibility.`
    `Choose a color on your board having the highest top card. Meld the bottom card on your board of that color. If that color has more than one card, claim an achievement, ignoring eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .utilHighestCards(game.getTopCards(player))
        .map(card => card.color)
      const colors = game.aChoose(player, choices, { title: 'Choose a color' })
      if (colors && colors.length > 0) {
        const color = colors[0]
        const cards = game.getCardsByZone(player, color)
        game.aMeld(player, cards[cards.length - 1])

        if (cards.length > 1) {
          const achs = game.getAvailableAchievementsRaw(player)
          game.aChooseAndAchieve(player, achs)
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
