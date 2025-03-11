const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Handbag`  // Card names are unique in Innovation
  this.name = `Handbag`
  this.color = `green`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hcic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may choose to either transfer your bottom card of each color to your hand, or tuck all cards from your score pile, or choose a value and score all cards from your hand of that value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = [
        'Transfer bottom cards to hand',
        'Tuck score pile',
        'Score cards of chosen value from hand'
      ]

      const choice = game.aChoose(player, choices)[0]

      if (choice === choices[0]) {
        const cards = game.getBottomCards(player)
        game.aTransferMany(player, cards, game.getZoneByPlayer(player, 'hand'))
      }
      else if (choice === choices[1]) {
        const cards = game.getCardsByZone(player, 'score')
        game.aTuckMany(player, cards)
      }
      else if (choice === choices[2]) {
        const values = game.getCardsByZone(player, 'hand').map(c => c.getAge())
        const value = game.aChooseAge(player, util.array.distinct(values).sort())
        const toScore = game.getCardsByZone(player, 'hand').filter(c => c.getAge() === value)
        game.aScoreMany(player, toScore)
      }
      else {
        throw new Error('Invalid choice: ' + choice)
      }
    },
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
