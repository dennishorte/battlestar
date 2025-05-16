const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Silk`  // Card names are unique in Innovation
  this.name = `Silk`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `cclh`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand.`,
    `You may score a card from your hand of each color on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.getCardsByZone(player, 'hand')
      game.aChooseAndMeld(player, cards)
    },
    (game, player) => {
      const boardColors = game
        .getTopCards(player)
        .map(card => card.color)

      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => boardColors.includes(card.color))

      while (true) {
        const choiceColors = util.array.distinct(choices.map(c => c.color))

        const toScore = game.aChooseCards(player, choices, {
          title: 'You may score a card from your hand of each color on your board.',
          min: 0,
          max: choiceColors.length,
        })

        if (util.array.isDistinct(toScore.map(c => c.color))) {
          game.aScoreMany(player, toScore)
          break
        }
        else {
          game.log.add({ template: 'Must choose only one card per color' })
          continue
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
