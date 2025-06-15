const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Holography`  // Card names are unique in Innovation
  this.name = `Holography`
  this.color = `purple`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `pphp`
  this.dogmaBiscuit = `p`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose red, blue, or green. Score all but your top two cards of that color, then splay it aslant. If you do both, exchange all the lowest cards in your score pile with all your claimed standard achievements of lower value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const color = game.actions.choose(player, ['red', 'blue', 'green'], {
        title: 'Choose a color to score and splay'
      })[0]

      const cards = game.getCardsByZone(player, color)
      const toScore = cards.slice(2)
      const scored = game.aScoreMany(player, toScore)

      const splayed = game.aSplay(player, color, 'aslant')

      if (scored.length > 0 && scored.length === toScore.length && splayed) {
        const lowestScoreCards = game.utilLowestCards(game.getCardsByZone(player, 'score'))

        if (!lowestScoreCards) {
          game.log.addDoNothing()
          return
        }

        const lowestScoreCardsValue = lowestScoreCards[0].getAge()

        const matchingAchievements = game
          .getCardsByZone(player, 'achievements')
          .filter(card => card.checkIsStandardAchievement())
          .filter(card => card.getAge() < lowestScoreCardsValue)

        game.aExchangeCards(
          player,
          lowestScoreCards,
          matchingAchievements,
          game.getZoneByPlayer(player, 'score'),
          game.getZoneByPlayer(player, 'achievements'),
        )
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
