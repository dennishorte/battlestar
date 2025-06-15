const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Marcha Real`  // Card names are unique in Innovation
  this.name = `Marcha Real`
  this.color = `purple`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `llhc`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal and return two cards from your hand. If they have the same value, draw a card of value one higher. If they have the same color, claim an achievement, ignoring elibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.actions.chooseCards(player, game.getCardsByZone(player, 'hand'), { count: 2 })

      if (cards && cards.length > 0) {
        game.aRevealMany(player, cards, { ordered: true })
        game.aReturnMany(player, cards)
      }

      if (cards && cards.length === 2) {
        if (cards[0].getAge() === cards[1].getAge()) {
          game.aDraw(player, { age: cards[0].getAge() + 1 })
        }

        if (cards[0].color === cards[1].color) {
          const choices = game.getAvailableAchievementsRaw(player)
          game.aChooseAndAchieve(player, choices)
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
