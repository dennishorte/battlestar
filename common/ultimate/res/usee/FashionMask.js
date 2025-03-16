const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fashion Mask`  // Card names are unique in Innovation
  this.name = `Fashion Mask`
  this.color = `yellow`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a top card with {c} or {f} of each color on your board. You may safeguard one of the tucked cards.`,
    `Score all but the top five each of your yellow and purple cards. Splay those colors aslant.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toTuck = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('c') || card.checkHasBiscuit('f'))

      const tucked = game.aTuckMany(player, toTuck)
      game.aChooseAndSafeguard(player, tucked, { min: 0 })
    },
    (game, player) => {
      const yellows = game
        .getCardsByZone(player, 'yellow')
        .slice(5)

      const purples = game
        .getCardsByZone(player, 'purple')
        .slice(5)

      const toScore = [...yellows, ...purples]

      game.aScoreMany(player, toScore)

      game.aSplay(player, 'yellow', 'aslant')
      game.aSplay(player, 'purple', 'aslant')
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
