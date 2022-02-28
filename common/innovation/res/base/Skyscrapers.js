const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Skyscrapers`  // Card names are unique in Innovation
  this.name = `Skyscrapers`
  this.color = `yellow`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `hfcc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top non-yellow card with a {i} from your board to my board! If you do, score the card beneath it, and return all other cards from that pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('i'))
      const cards = game.aChooseAndTransfer(player, choices, { toBoard: true, player: leader })
      if (cards && cards.length > 0) {
        const remaining = game.getCardsByZone(player, cards[0].color)
        if (remaining.length > 0) {
          game.aScore(player, remaining[0])
        }
        game.aReturnMany(player, remaining.slice(1), { ordered: true })
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
