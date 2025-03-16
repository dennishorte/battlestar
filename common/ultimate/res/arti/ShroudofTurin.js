const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shroud of Turin`  // Card names are unique in Innovation
  this.name = `Shroud of Turin`
  this.color = `purple`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `lhll`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. If you do, return a top card from your board and a card from your score pile of the returned card's color. If you did all three, claim an achievement ignoring eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      if (returned && returned.length > 0) {
        let totalReturned = 1

        const card = returned[0]
        const top = game.getTopCard(player, card.color)
        if (top && game.aReturn(player, top)) {
          totalReturned += 1
        }

        const fromScore = game
          .getCardsByZone(player, 'score')
          .filter(c => c.color === card.color)
        const score = game.aChooseAndReturn(player, fromScore)
        if (score && score.length > 0) {
          totalReturned += 1
        }

        if (totalReturned === 3) {
          game.aChooseAndAchieve(player, game.getAvailableAchievementsRaw(player))
        }
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
