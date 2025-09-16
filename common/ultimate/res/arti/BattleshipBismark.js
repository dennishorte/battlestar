const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Battleship Bismark`  // Card names are unique in Innovation
  this.name = `Battleship Bismark`
  this.color = `red`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to draw and reveal an {8}! Return all cards of the drawn card's color from your board!`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 8))
      if (card) {
        const toReturn = game.getCardsByZone(player, card.color)
        game.aReturnMany(player, toReturn, { ordered: true })
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
