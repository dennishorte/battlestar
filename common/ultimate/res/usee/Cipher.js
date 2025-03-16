const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cipher`  // Card names are unique in Innovation
  this.name = `Cipher`
  this.color = `green`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `hssk`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. If you return at least two, draw a card of value one higher than the highest value of card you return.`,
    `Draw a {2}. You may splay your blue cards left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aReturnMany(player, game.getCardsByZone(player, 'hand'))

      if (returned.length >= 2) {
        const highestValue = Math.max(...returned.map(card => card.getAge()))
        game.aDraw(player, { age: highestValue + 1 })
      }
    },
    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 2) })
      game.aChooseAndSplay(player, ['blue'], 'left')
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
