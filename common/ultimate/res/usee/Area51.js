const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Area 51`  // Card names are unique in Innovation
  this.name = `Area 51`
  this.color = `green`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your green cards up.`,
    `Choose to either draw a {e}, or safeguard an available standard achievement.`,
    `Reveal one of your secrets, and super-execute it if it is your turn.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'up')
    },
    (game, player) => {
      const choices = [
        'Draw a ' + game.getEffectAge(this, 11),
        'Safeguard a standard achievement',
      ]
      const choice = game.aChoose(player, choices)[0]

      if (choice === choices[0]) {
        game.aDraw(player, { age: game.getEffectAge(this, 11) })
      }
      else {
        const available = game.getAvailableStandardAchievements(player)
        const achievement = game.aChooseCards(player, available, { hidden: true })[0]

        if (achievement) {
          game.aSafeguard(player, achievement)
        }
      }
    },
    (game, player) => {
      const secrets = game.getCardsByZone(player, 'safe')
      const secret = game.aChooseCards(player, secrets, {
        title: 'Choose a secret to reveal and execute',
        hidden: true,
      })[0]

      if (secret) {
        game.mReveal(player, secret)

        if (game.players.current() === player) {
          game.aSuperExecute(player, secret)
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
