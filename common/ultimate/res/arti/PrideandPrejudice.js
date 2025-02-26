const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pride and Prejudice`  // Card names are unique in Innovation
  this.name = `Pride and Prejudice`
  this.color = `yellow`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `hsls`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {6}. If the drawn card's color is the color with the fewest (or tied) number of cards on your board, score the melded card, and repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.aDrawAndMeld(player, game.getEffectAge(this, 6))

        if (card) {
          const numCards = game
            .getCardsByZone(player, card.color)
            .length

          const hasFewestCards = game
            .utilColors()
            .map(color => game.getCardsByZone(player, color).length)
            .every(count => count >= numCards)

          if (hasFewestCards) {
            game.aScore(player, card)
            continue
          }
          else {
            break
          }
        }
        else {
          break
        }
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
