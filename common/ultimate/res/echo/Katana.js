const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Katana`  // Card names are unique in Innovation
  this.name = `Katana`
  this.color = `red`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer two top cards with a {k} from your board to my score pile! If you transfered exactly one, and Katana was foreseen, junk all available standard achievements.`,
  ]

  this.dogmaImpl = [
    (game, player, { leader, foreseen, self }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      const transferred = game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'), { count: 2 })

      if (transferred && transferred.length === 1 && foreseen) {
        game.mLogWasForeseen(self)
        const achievements = game.getAvailableStandardAchievements(player)
        game.aJunkMany(player, achievements, { ordered: true })
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
