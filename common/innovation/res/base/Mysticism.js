const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mysticism`  // Card names are unique in Innovation
  this.name = `Mysticism`
  this.color = `purple`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {1}. If it is the same color as any card on your board, meld it and draw a {1}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 1))
      const boardColors = game
        .getTopCards(player)
        .map(card => card.color)

      if (boardColors.includes(card.color)) {
        game.aMeld(player, card)
        game.aDraw(player, game.getEffectAge(this, 1))
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
