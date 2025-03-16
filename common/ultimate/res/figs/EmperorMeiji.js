const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Emperor Meiji`  // Card names are unique in Innovation
  this.name = `Emperor Meiji`
  this.color = `purple`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `hii*`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = [
    `If you would meld a card of value 10 and you have top cards of values 9 and 8 on your board, instead you win.`,
    `Each card in your forecast counts as being in your hand.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const cardCondition = card.getAge() === 10
        const nineCondition = game
          .getTopCards(player)
          .filter(card => card.getAge() === 9)
          .length > 0
        const eightCondition = game
          .getTopCards(player)
          .filter(card => card.getAge() === 8)
          .length > 0
        return cardCondition && nineCondition && eightCondition
      },
      func: (game, player) => {
        throw new GameOverEvent({
          player,
          reason: 'Emperor Meiji'
        })
      }
    },

    {
      trigger: 'list-hand',
      func: (game, player) => {
        return [
          ...game.getZoneByPlayer(player, 'hand')._cards,
          ...game.getZoneByPlayer(player, 'forecast')._cards,
        ]
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
