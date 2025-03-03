const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Padlock`  // Card names are unique in Innovation
  this.name = `Padlock`
  this.color = `red`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `ckhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer one of your secrets to the available achievements!`,
    `If no card was transferred due to the demand, you may score up to three cards from your hand of different values.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const secrets = game.getCardsByZone(player, 'safe')

      if (secrets.length === 0) {
        game.mLog({ template: 'no secrets to transfer' })
        return
      }

      const secret = game.aChooseCards(player, secrets, { hidden: true })[0]
      const transferred = game.aTransfer(player, secret, game.getZoneById('achievements'))
      if (transferred) {
        game.state.dogmaInfo.padlockCardTransferred = true
      }
    },
    (game, player, { leader }) => {
      if (!game.state.dogmaInfo.padlockCardTransferred) {
        game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'), {
          title: 'Choose up the three cards of different values',
          min: 0,
          max: 3,
          guard: (cards) => util.array.isDistinct(cards.map(c => c.getAge()))
        })
      }
      else {
        game.mLogNoEffect()
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
