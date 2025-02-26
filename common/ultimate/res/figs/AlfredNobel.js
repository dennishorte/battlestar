const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alfred Nobel`  // Card names are unique in Innovation
  this.name = `Alfred Nobel`
  this.color = `green`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `chc*`
  this.dogmaBiscuit = `c`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.karma = [
    `Each icon type on your board counts as an achievement, if you have at least twice as many of that icon as every other player.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    const choices = game
      .getZoneByPlayer(player, 'hand')
      .cards()
    game.aChooseAndScore(player, choices)
  }
  this.karmaImpl = [
    {
      trigger: 'extra-achievements',
      func(game, player) {
        const biscuits = game.getBiscuits()
        const playerBiscuits = biscuits[player.name]

        let bonusAchievements = 0
        for (const biscuit of Object.keys(playerBiscuits)) {
          // Must have at least one of these biscuits for it to count.
          if (playerBiscuits[biscuit] === 0) {
            continue
          }

          let match = true
          for (const opp of game.getPlayerOpponents(player)) {
            const oppBiscuits = biscuits[opp.name]
            if (playerBiscuits[biscuit] < oppBiscuits[biscuit] * 2) {
              match = false
              break
            }
          }

          if (match) {
            bonusAchievements += 1
          }
        }

        return bonusAchievements
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
