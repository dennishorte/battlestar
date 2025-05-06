const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Popular Science`  // Card names are unique in Innovation
  this.name = `Popular Science`
  this.color = `blue`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `scsh`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a card of value equal to the value of a top green card anywhere.`,
    `Draw and meld a card of value one higher than the value of your top yellow card.`,
    `You may splay your blue cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topGreenCards = game
        .getPlayerAll()
        .map(player => game.getTopCard(player, 'green'))
        .filter(card => card !== undefined)

      if (topGreenCards.length === 0) {
        game.mLog({ template: 'No player has a top green card.' })
        return
      }

      const ages = util.array.distinct(topGreenCards.map(card => card.getAge()))
      const age = game.aChooseAge(player, ages, { title: 'Choose age of card to draw and meld' })
      game.aDrawAndMeld(player, age)
    },

    (game, player) => {
      const topYellowCard = game.getTopCard(player, 'yellow')
      if (!topYellowCard) {
        game.mLogNoEffect()
        return
      }

      const age = topYellowCard.getAge() + 1
      game.aDrawAndMeld(player, age)
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
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
