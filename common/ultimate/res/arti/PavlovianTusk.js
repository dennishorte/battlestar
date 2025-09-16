const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pavlovian Tusk`  // Card names are unique in Innovation
  this.name = `Pavlovian Tusk`
  this.color = `red`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hckc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw three cards of value equal to your top green card. Return one of the drawn cards. Score one of the drawn cards.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topGreen = game.getTopCard(player, 'green')
      const age = topGreen ? topGreen.age : 1
      const cards = [
        game.aDraw(player, { age }),
        game.aDraw(player, { age }),
        game.aDraw(player, { age }),
      ]

      const returned = game.aChooseAndReturn(player, cards) || []
      const remainining = cards.filter(card => !returned.includes(card))
      game.aChooseAndScore(player, remainining)
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
