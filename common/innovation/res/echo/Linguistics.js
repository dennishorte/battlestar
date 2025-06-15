const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Linguistics`  // Card names are unique in Innovation
  this.name = `Linguistics`
  this.color = `blue`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {3} OR Draw and foreshadow a {4}.`
  this.karma = []
  this.dogma = [
    `Draw a card of value equal to a bonus on your board, if you have any.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const bonuses = util.array.distinct(game.getBonuses(player)).sort()
      const age = game.aChooseAge(player, bonuses, { title: 'Choose an age to draw from' })
      if (age) {
        game.aDraw(player, { age })
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = [
      `Draw a ${game.getEffectAge(this, 3)}`,
      `Draw and foreshadow a ${game.getEffectAge(this, 4)}`,
    ]
    const choice = game.actions.choose(player, choices)[0]

    if (choice.includes('foreshadow')) {
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 4))
    }
    else {
      game.aDraw(player, { age: game.getEffectAge(this, 3) })
    }
  }
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
