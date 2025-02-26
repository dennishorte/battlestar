const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hudson's Bay Company Archives`  // Card names are unique in Innovation
  this.name = `Hudson's Bay Company Archives`
  this.color = `green`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `chfc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score the bottom card of every color on your board. Meld a card from your score pile. Splay right the color of the melded card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toScore = game
        .utilColors()
        .flatMap(color => game.getCardsByZone(player, color).slice(-1))
      game.aScoreMany(player, toScore)

      const cards = game.aChooseAndMeld(player, game.getCardsByZone(player, 'score'))
      if (cards && cards.length > 0) {
        game.aSplay(player, cards[0].color, 'right')
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
