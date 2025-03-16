const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Cryptocurrency`  // Card names are unique in Innovation
  this.name = `Cryptocurrency`
  this.color = `green`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `cffh`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your score pile. For each different value of card you return, draw and score a {0}.`,
    `You may splay your red cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const scorePile = game.getZoneByPlayer(player, 'score')
      const returned = game.aReturnMany(player, scorePile.cards())

      const uniqueAges = util.array.distinct(returned.map(card => card.getAge()))
      uniqueAges.forEach(() => {
        game.aDrawAndScore(player, game.getEffectAge(this, 10))
      })
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'up')
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
