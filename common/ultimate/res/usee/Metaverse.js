const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Metaverse`
  this.name = `Metaverse`
  this.color = `purple`
  this.age = 11
  this.expansion = `usee` // Expansion should be 'base', not 'usee'
  this.biscuits = `spph`
  this.dogmaBiscuit = `p`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each splayed color on your board, score its top card. If you score fewer than three cards, you lose.`
  ]

  this.dogmaImpl = [
    (game, player, { self }) => {
      const topSplayedCards = game
        .getTopCards(player)
        .filter(c => game.checkColorIsSplayed(player, c.color))

      const scored = game.aScoreMany(player, topSplayedCards)

      if (scored.length < 3) {
        game.log.add({
          template: '{player} scored fewer than three cards and loses the game!',
          args: { player }
        })
        game.aYouLose(player, self)
      }
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
