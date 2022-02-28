const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Pirate Code`  // Card names are unique in Innovation
  this.name = `The Pirate Code`
  this.color = `red`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `cfch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer two cards of value {4} or less from your score pile to my score pile!`,
    `If any cards were transferred due to the demand, score the lowest top card with a {c} from your board.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game.getCardsByZone(player, 'score')
      const target = game.getZoneByPlayer(leader, 'score')
      const transferred = game.aChooseAndTransfer(player, choices, target, { count: 2 })
      if (transferred && transferred.length > 0) {
        game.state.dogmaInfo.piratesLooted = true
      }
    },

    (game, player) => {
      if (game.state.dogmaInfo.piratesLooted) {
        const choices = game
          .getTopCards(player)
          .filter(card => card.checkHasBiscuit('c'))
        const cards = game.aChooseLowest(player, choices, 1)
        if (cards && cards.length > 0) {
          game.aScore(player, cards[0])
        }
      }
      else {
        game.mLogNoEffect()
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
