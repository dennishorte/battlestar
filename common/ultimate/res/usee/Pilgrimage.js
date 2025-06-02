const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pilgrimage`  // Card names are unique in Innovation
  this.name = `Pilgrimage`
  this.color = `red`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card of value 1 from your hand. If you do, safeguard an available achievement of value equal to the returned card, then repeat this effect using a value one higher.`,
    `You may junk all cards in the {1} deck.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      let value = 1

      while (true) {
        const choices = game.getCardsByZone(player, 'hand').filter(c => c.age === value)
        const card = game.aChooseAndReturn(player, choices, { min: 0, max: 1 })[0]

        if (!card) {
          break
        }

        const availableAchievements = game.getAvailableAchievementsByAge(player, value)

        if (availableAchievements.length > 0) {
          game.aSafeguard(player, availableAchievements[0])
        }
        else {
          game.log.addNoEffect()
        }

        value++
      }
    },
    (game, player) => {
      game.aJunkDeck(player, 1, { optional: true })
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
