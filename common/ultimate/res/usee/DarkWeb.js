const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dark Web`  // Card names are unique in Innovation
  this.name = `Dark Web`
  this.color = `red`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `fhii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Unsplay any color on any board.`,
    `Choose to either safeguard any number of available standard achievements, or achieve any number of secrets from your safe regardless of eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const playerChoices = game
        .getPlayerAll()
        .flatMap(player => 
          game.utilColors().map(color => ({
            player,
            color,
            splay: game.getZoneByPlayer(player, color).splay
          }))
        )
        .filter(({ splay }) => splay !== null)
        
      const { player: targetPlayer, color } = game.aChooseOne(player, playerChoices, {
        title: 'Unsplay a color on any board'
      })
      
      game.mLog({
        template: '{player} unsplays {targetPlayer}\'s {color} cards',
        args: { player, targetPlayer, color }
      })
      
      game.aSplayColor(targetPlayer, color, null)
    },

    (game, player) => {    
      const choices = [
        'Safeguard achievements',
        'Achieve secrets'
      ]

      const choice = game.aChooseOne(player, choices, {
        title: 'Choose an action'
      })

      if (choice === choices[0]) {
        // Safeguard achievements
        const available = game
          .getAvailableStandardAchievements()

        const toSafeguard = game.aChooseMany(player, available, {
          title: 'Choose achievements to safeguard',
          min: 0
        })

        toSafeguard.forEach(card => {
          game.mLogNoEffect()
          game.mSafeguardAchievement(player, card)
        })
      }
      else if (choice === choices[1]) {
        // Achieve secrets
        const secrets = game
          .getZoneByPlayer(player, 'safe')
          .cards()
          .filter(c => c.isSecret)

        const toAchieve = game.aChooseMany(player, secrets, {
          title: 'Choose secrets to achieve',
          min: 0  
        })

        toAchieve.forEach(card => {
          game.mLog({
            template: '{player} achieves the secret {card} directly from their safe',
            args: { player, card }
          })
          game.aAchieveFromSafe(player, card)
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