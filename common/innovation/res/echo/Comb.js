const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Comb`  // Card names are unique in Innovation
  this.name = `Comb`
  this.color = `green`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `kklh`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color, then draw and reveal five {1}s. Keep all cards that match the color chosen. Return the rest of the drawn cards.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const color = game.aChoose(player, game.utilColors(), { title: 'Choose a Color' })[0]
      const cards = [
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 1)),
      ].filter(card => card !== undefined)

      const matching = cards
        .filter(card => card.color === color)
        .forEach(card => game.mLog({
          template: '{player} keeps {card}',
          args: { player, card }
        }))

      const others = cards
        .filter(card => card.color !== color)

      game.aReturnMany(player, others)
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
