const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stove`  // Card names are unique in Innovation
  this.name = `Stove`
  this.color = `yellow`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `h6f&`
  this.dogmaBiscuit = `f`
  this.echo = `Score a top card from your board without a {f}.`
  this.karma = []
  this.dogma = [
    `Draw and tuck a {4}. If your top card of the tucked card's color has value less than {4}, draw and score a {4}.`,
    `You may splay your green cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const tucked = game.aDrawAndTuck(player, game.getEffectAge(this, 4))
      if (tucked) {
        const top = game.getTopCard(player, tucked.color)
        if (top.getAge() < game.getEffectAge(this, 4)) {
          game.aDrawAndScore(player, game.getEffectAge(this, 4))
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'right')
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getTopCards(player)
      .filter(card => !card.checkHasBiscuit('f'))
    game.aChooseAndScore(player, choices)
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
