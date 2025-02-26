const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Feudalism`  // Card names are unique in Innovation
  this.name = `Feudalism`
  this.color = `purple`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `hklk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card with a {k} from your hand to my hand! If you do, unsplay that color of your cards!`,
    `You may splay your yellow or purple cards left.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      const cards = game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        game.aUnsplay(player, game.getZoneByPlayer(player, card.color))
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'purple'], 'left')
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
