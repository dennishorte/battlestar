const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chartreuse`  // Card names are unique in Innovation
  this.name = `Chartreuse`
  this.color = `yellow`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `lfhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {3}, a {4}, a {5}, and a {6}. Meld each drawn green card and each drawn yellow card, in any order. Return the other drawn cards.`,
    `You may splay your green or yellow cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = [
        game.aDrawAndReveal(player, game.getEffectAge(this, 3)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 4)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 5)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 6)),
      ]

      const greenAndYellow = cards.filter(card => card.color === 'green' || card.color === 'yellow')
      const others = cards.filter(card => card.color !== 'green' && card.color !== 'yellow')

      game.aMeldMany(player, greenAndYellow)
      game.aReturnMany(player, others)
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['green', 'yellow'], 'right')
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
