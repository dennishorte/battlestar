const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Enigma Machine`  // Card names are unique in Innovation
  this.name = `Enigma Machine`
  this.color = `red`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `iihi` 
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either safeguard all available standard achievements, transfer all your secrets to your hand, or transfer all cards in your hand to the available achievements.`,
    `Choose a color you have splayed left and splay it up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = [
        'Safeguard all available standard achievements',
        'Transfer all your secrets to your hand',
        'Transfer all cards in your hand to the available achievements'
      ]
      const choice = game.aChoose(player, choices, { title: 'Choose one:' })

      if (choice === choices[0]) {
        const achievements = game.getAvailableAchievements()
        game.aSafeguardMany(player, achievements) 
      } 
      else if (choice === choices[1]) {
        const secrets = game.getZoneByPlayer(player, 'secrets').cards()
        game.aTransferMany(player, secrets, game.getZoneByPlayer(player, 'hand'))
      }
      else if (choice === choices[2]) {
        const hand = game.getZoneByPlayer(player, 'hand').cards()
        game.aTransferMany(player, hand, game.getZoneById('achievements'))
      }
    },
    (game, player) => {
      const colors = game.utilColors().filter(color => {
        return game.getZoneByPlayer(player, color).splay === 'left' 
      })
      game.aChooseAndSplay(player, colors, 'up')
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