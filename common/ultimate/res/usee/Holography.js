const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Holography`  // Card names are unique in Innovation
  this.name = `Holography`
  this.color = `purple`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `pphp`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose red, blue, or green. Score all but your top two cards of that color, then splay it aslant. If you do both, exchange all the lowest cards in your score pile with all your claimed standard achievements of lower value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const color = game.aChoose(player, ['red', 'blue', 'green'], {
        title: 'Choose a color to score and splay'
      })[0]
      
      const cards = game.getCardsByZone(player, color)
      const toScore = cards.slice(2)
      game.aScoreMany(player, toScore)

      const splayed = game.aSplay(player, color, 'aslant')

      if (toScore.length > 0 && splayed) {
        const lowestScoreCards = game.utilLowestCards(game.getCardsByZone(player, 'score'))
        const lowestAchievements = game.utilLowestCards(game.getClaimedStandardAchievements(player)).filter(a => a.age < Math.min(...lowestScoreCards.map(c => c.age)))

        game.mMoveCardsTo(lowestScoreCards, game.getZoneById('achievements'), { player })
        game.mMoveCardsTo(lowestAchievements, game.getZoneByPlayer(player, 'score'), { player })
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