const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Pantheism`  // Card names are unique in Innovation
  this.name = `Pantheism`
  this.color = `purple`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `hlss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a card from your hand. If you do, draw and tuck a {4}, score all cards on your board of the color of one of the tucked cards, and splay right the color on your board of the other tucked card.`,
    `Draw and tuck a {4}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const handCards = game.getCardsByZone(player, 'hand')
      const firstCard = game.aChooseAndTuck(player, handCards)[0]

      if (firstCard) {
        const secondCard = game.aDraw(player, { age: game.getEffectAge(this, 4) })
        game.aTuck(player, secondCard)

        const colorChoices = util.array.distinct([firstCard.color, secondCard.color])
        const colorToScore = game.actions.choose(player, colorChoices, {
          title: 'Choose a color to score',
        })[0]

        const cardsToScore = game.getCardsByZone(player, colorToScore)
        game.aScoreMany(player, cardsToScore)

        const colorToSplay = colorToScore === firstCard.color ? secondCard.color : firstCard.color
        game.aSplay(player, colorToSplay, 'right')
      }
    },
    (game, player) => {
      game.aDrawAndTuck(player, game.getEffectAge(this, 4))
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
