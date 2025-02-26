const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sibidu Needle`  // Card names are unique in Innovation
  this.name = `Sibidu Needle`
  this.color = `blue`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `kkkh`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {1}. If you have a top card of matching color and value to the drawn card, score the drawn card and repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 1))
        if (card) {
          const top = game.getTopCard(player, card.color)
          if (top && top.getAge() === card.getAge()) {
            game.aScore(player, card)
          }
          else {
            break
          }
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
