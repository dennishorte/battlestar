const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Perspective`  // Card names are unique in Innovation
  this.name = `Perspective`
  this.color = `yellow`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hssl`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you do, score a card from your hand for every two {s} on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(
        player,
        game.getCardsByZone(player, 'hand'),
        { min: 0, max: 1 }
      )

      if (cards && cards.length > 0) {
        const count = Math.floor(game.getBiscuitsByPlayer(player).s / 2)
        game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'), { count })
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
