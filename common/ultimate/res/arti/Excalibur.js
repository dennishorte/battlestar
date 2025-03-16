const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Excalibur`  // Card names are unique in Innovation
  this.name = `Excalibur`
  this.color = `red`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `chkk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel your to transfer a top card of higher value than my top card of the same color from your board to my board!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .utilColors()
        .map(color => {
          const playerTop = game.getTopCard(player, color)
          const leaderTop = game.getTopCard(leader, color)

          if (!playerTop) {
            return undefined
          }
          else if (!leaderTop) {
            return playerTop
          }
          else if (playerTop.getAge() > leaderTop.getAge()) {
            return playerTop
          }
          else {
            return undefined
          }
        })
        .filter(card => !!card)

      const card = game.aChooseCard(player, choices)
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
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
