const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dark Web`  // Card names are unique in Innovation
  this.name = `Dark Web`
  this.color = `red`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `fhii`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Unsplay any color on any board.`,
    `Choose to either safeguard any number of available standard achievements, or achieve any number of secrets from your safe regardless of eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = []

      for (const other of game.players.startingWith(player)) {
        const colors = game
          .utilColors()
          .filter(color => game.getZoneByPlayer(other, color).splay !== 'none')

        if (colors.length > 0) {
          choices.push({
            title: other.name,
            choices: colors,
            min: 0
          })
        }
      }

      const selected = game.actions.choose(player, choices, {
        title: 'Choose a color to unsplay',
      })[0]

      if (selected) {
        const otherName = selected.title
        const other = game.players.byName(otherName)
        const color = selected.selection[0]

        game.aUnsplay(other, color)
      }
    },

    (game, player) => {
      const choices = [
        'Safeguard achievements',
        'Achieve secrets'
      ]

      const choice = game.actions.choose(player, choices)[0]

      if (choice === choices[0]) {
        // Safeguard achievements
        const available = game.getAvailableStandardAchievements(player)

        const max = Math.min(available.length, game.getSafeOpenings(player))
        game.aChooseAndSafeguard(player, available, {
          title: 'Choose achievements to safeguard',
          min: 0,
          max,
          hidden: true,
        })
      }
      else if (choice === choices[1]) {
        // Achieve secrets
        const secrets = game.getCardsByZone(player, 'safe')
        const toAchieve = game.aChooseCards(player, secrets, {
          title: 'Choose secrets to achieve',
          min: 0,
          max: secrets.length,
          hidden: true,
        })

        toAchieve.forEach(card => {
          game.aClaimAchievement(player, card)
        })
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
