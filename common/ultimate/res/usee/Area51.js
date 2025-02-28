const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Area 51`  // Card names are unique in Innovation
  this.name = `Area 51`
  this.color = `green`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your green cards up.`,
    `Choose to either draw a {9}, or safeguard an available standard achievement.`,
    `Reveal one of your secrets, and super-execute it if it is your turn.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'up')
    },
    (game, player) => {
      const choices = ['Draw a 9', 'Safeguard a standard achievement']
      const choice = game.aChoose(player, choices)

      if (choice === choices[0]) {
        game.aDraw(player, { age: game.getEffectAge(this, 9) })
      } else {
        const available = game.getAvailableStandardAchievements()
        const achievement = game.aChooseCard(player, available)
        
        if (achievement) {
          game.aSafeguard(player, achievement)
        }
      }
    },
    (game, player) => {
      const secrets = game
        .getZoneByPlayer(player, 'secrets')
        .cards()

      const secret = game.aChooseCard(player, secrets, { title: 'Choose a secret to reveal and execute' })

      if (secret) {
        game.mReveal(player, secret)

        if (game.getCurrentPlayer() === player) {
          game.mLog({
            template: '{player} super-executes {card}',
            args: { player, card: secret }
          })
          game.aSuperStarEffect(player, secret)
        }
      }
    }
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