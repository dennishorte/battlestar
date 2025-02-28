const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Metaverse`  
  this.name = `Metaverse`
  this.color = `purple`
  this.age = 11
  this.expansion = `base` // Expansion should be 'base', not 'usee'
  this.biscuits = `spph`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each splayed color on your board, score its top card. If you score fewer than three cards, you lose.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const splayedColors = ['red', 'green', 'yellow', 'blue', 'purple']
        .filter(color => game.getZoneByPlayer(player, color).splay !== '')

      const scoredCards = splayedColors.map(color => {
        const topCard = game.getTopCard(player, color)
        game.aScore(player, topCard)
        return topCard
      })

      if (scoredCards.length < 3) {
        game.mLog({
          template: '{player} scored fewer than three cards and loses the game!',
          args: { player }
        })
        throw new GameOverEvent({
          reason: 'Metaverse',
          player
        })
      }
    },
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