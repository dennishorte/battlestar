const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Confession`  // Card names are unique in Innovation
  this.name = `Confession`
  this.color = `purple`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a top card with {k} of each color from your board. If you return none, meld a card from your score pile, then draw and score a {4}.`,
    `Draw a {4} for each {4} in your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topCastleCards = game
        .getTopCards(player)
        .filter(c => c.checkHasBiscuit('k'))

      const returned = game.aReturnMany(player, topCastleCards)

      if (returned.length === 0) {
        game.aChooseAndMeld(player, game.getCardsByZone(player, 'score'))
        game.aDrawAndScore(player, game.getEffectAge(this, 4))
      }
    },
    (game, player) => {
      const age = game.getEffectAge(this, 4)
      const scorePile = game
        .getCardsByZone(player, 'score')
        .filter(c => c.getAge() === age)
        .length

      for (let i = 0; i < scorePile; i++) {
        game.aDraw(player, { age })
      }
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
