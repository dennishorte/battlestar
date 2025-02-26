const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Buttonwood Agreement`  // Card names are unique in Innovation
  this.name = `Buttonwood Agreement`
  this.color = `green`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `fcfh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose three colors. Draw and reveal a {8}. If the drawn card is one of the chosen colors, score it and splay up that color. Otherwise, return all cards of the drawn card's color from your score pile, and unsplay that color.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colors = game.aChoose(player, game.utilColors(), { count: 3 })
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 8))

      if (colors.includes(card.color)) {
        game.aScore(player, card)
        game.aSplay(player, card.color, 'up')
      }
      else {
        const toReturn = game
          .getCardsByZone(player, 'score')
          .filter(other => other.color === card.color)
        game.aReturnMany(player, toReturn)
        game.aUnsplay(player, game.getZoneByPlayer(player, card.color))
      }
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
