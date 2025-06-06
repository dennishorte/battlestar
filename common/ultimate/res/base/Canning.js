const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Canning`  // Card names are unique in Innovation
  this.name = `Canning`
  this.color = `yellow`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `hflf`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may draw and tuck a {6}. If you tuck a card, score a top card without a {f} of each color on your board.`,
    `You may splay your yellow cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const decision = game.aYesNo(player, 'Draw and tuck a {6}?')
      if (decision) {
        game.aDrawAndTuck(player, game.getEffectAge(this, 6))

        const toReturn = game
          .getTopCards(player)
          .filter(card => !card.biscuits.includes('f'))

        game.aScoreMany(player, toReturn)
      }
      else {
        game.log.addDoNothing(player)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow'], 'right')
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
