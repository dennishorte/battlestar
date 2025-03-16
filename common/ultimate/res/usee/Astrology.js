const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Astrology`  // Card names are unique in Innovation
  this.name = `Astrology`
  this.color = `blue`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `cchl`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay left the color of which you have the most cards on your board.`,
    `Draw and meld a card of value equal to the number of visible purple cards on your board. If the melded card has no {c}, tuck it.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cardsPerColor = game
        .utilColors()
        .map(color => game.getCardsByZone(player, color).length)
      const mostCount = Math.max(...cardsPerColor)
      const choices = game
        .utilColors()
        .filter(color => game.getCardsByZone(player, color).length === mostCount)

      game.aChooseAndSplay(player, choices, 'left', { min: 0, max: 1 })
    },
    (game, player) => {
      const numPurpleCards = game.getVisibleCardsByZone(player, 'purple')
      const card = game.aDrawAndMeld(player, numPurpleCards)

      if (card && !card.checkHasBiscuit('c')) {
        game.aTuck(player, card)
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
