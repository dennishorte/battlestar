const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Denver Airport`  // Card names are unique in Innovation
  this.name = `Denver Airport`
  this.color = `green`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `cchp`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may achieve one of your secrets regardless of eligibility.`,
    `You may splay your purple cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const secrets = game
        .getZoneByPlayer(player, 'secrets')
        .cards()

      if (secrets.length > 0) {
        const secret = game.aChooseCard(player, secrets, { 
          title: 'Choose a secret to achieve',
          min: 0,
          max: 1
        })

        if (secret) {
          game.aAchieveSecret(player, secret)
        }
      }
      else {
        game.mLogNoEffect()
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
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