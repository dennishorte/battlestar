const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Steam Engine`  // Card names are unique in Innovation
  this.name = `Steam Engine`
  this.color = `yellow`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `hfcf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck two {4}, then score your bottom yellow card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndTuck(player, game.getEffectAge(this, 4))
      game.aDrawAndTuck(player, game.getEffectAge(this, 4))

      const cards = game.getCardsByZone(player, 'yellow')
      const card = cards[cards.length - 1]
      game.aScore(player, card)
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
