const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Combustion`  // Card names are unique in Innovation
  this.name = `Combustion`
  this.color = `red`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `ccfh`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer one card from your score pile to my score pile for every four {c} on my board!`,
    `Return your bottom red card.`
  ]

  this.dogmaImpl = [
    (game, player, { biscuits, leader }) => {
      const count = Math.floor(biscuits[leader.name].c / 4)
      const choices = game.getZoneByPlayer(player, 'score').cards()
      const target = game.getZoneByPlayer(leader, 'score')
      game.aChooseAndTransfer(player, choices, target, { count })
    },

    (game, player) => {
      const red = game.getZoneByPlayer(player, 'red').cards()
      if (red.length === 0) {
        game.mLogNoEffect()
      }
      else {
        game.aReturn(player, red[red.length - 1])
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
