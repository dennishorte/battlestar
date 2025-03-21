const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Watermill`  // Card names are unique in Innovation
  this.name = `Watermill`
  this.color = `yellow`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a card of value equal to a bonus on your board, if you have one.`,
    `Tuck a card from your hand. If Watermill was foreseen, tuck all cards from the deck of value equal to the tucked card.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const bonuses = game.getBonuses(player)
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => bonuses.includes(card.getAge()))
      game.aChooseAndTuck(player, choices)
    },

    (game, player, { foreseen, self }) => {
      const tucked = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))[0]

      if (tucked && foreseen) {
        game.mLogWasForeseen(self)
        const cards = game.getZoneByDeck('base', tucked.getAge()).cards()

        // The player can't look at the cards in the deck in advance, so they can't really pick an order.
        game.aTuckMany(player, cards, { ordered: true })
      }
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
