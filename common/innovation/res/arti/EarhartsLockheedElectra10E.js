const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Earhart's Lockheed Electra 10E`  // Card names are unique in Innovation
  this.name = `Earhart's Lockheed Electra 10E`
  this.color = `blue`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `ihii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each value below nine, return a top card of that value from your board, in descending order. If you return eight cards, you win. Otherwise, claim an achievement, ignoring eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      let returned = 0
      for (let i = 8; i > 0; i--) {
        const choices = game
          .getTopCards(player)
          .filter(card => card.getAge() === i)

        if (!choices) {
          game.mLog({ template: `no cards of value ${i}` })
          continue
        }

        const cards = game.aChooseAndReturn(player, choices)
        if (cards && cards.length > 0) {
          returned += 1
        }
        else {
          game.mLog({ template: 'no card was returned' })
        }
      }

      game.mLog({
        template: '{player} returned {count} cards',
        args: { player, count: returned }
      })
      if (returned === 8) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        const achievements = game
          .getAvailableAchievementsRaw(player)
        game.aChooseAndAchieve(player, achievements)
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
