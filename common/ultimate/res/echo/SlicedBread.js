const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sliced Bread`  // Card names are unique in Innovation
  this.name = `Sliced Bread`
  this.color = `green`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `&h9c`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Return all cards from your hand and draw two {8}.`
  this.karma = []
  this.dogma = [
    `Return a card from your score pile. Draw and score two cards of value one less than the value of the card returned.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'))[0]
      if (returned) {
        game.aDrawAndScore(player, returned.getAge() - 1)
        game.aDrawAndScore(player, returned.getAge() - 1)
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
    game.aDraw(player, { age: game.getEffectAge(this, 8) })
    game.aDraw(player, { age: game.getEffectAge(this, 8) })
  }
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
