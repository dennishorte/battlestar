const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Proverb`  // Card names are unique in Innovation
  this.name = `Proverb`
  this.color = `blue`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `hckk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw, reveal, and return a {1}. If the color of the returned card is yellow or purple, safeguard an available achievement of value equal to a card in your hand, then return all cards from your hand. Otherwise, draw two {1}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 1))
      const returned = game.aReturn(player, card)

      if (returned) {
        if (card.color === 'yellow' || card.color === 'purple') {
          const handAges = game.getCardsByZone(player, 'hand').map(c => c.getAge())
          const maxAge = Math.max(...handAges)
          const achievement = game.getAvailableAchievementsByAge(player, maxAge)[0]

          if (achievement) {
            game.aSafeguard(player, achievement)
          }

          game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
        }
        else {
          game.aDraw(player, { age: game.getEffectAge(this, 1) })
          game.aDraw(player, { age: game.getEffectAge(this, 1) })
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
