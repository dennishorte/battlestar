const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `April Fool's Day`  // Card names are unique in Innovation
  this.name = `April Fool's Day`
  this.color = `yellow`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hsll`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer a card from your hand or score pile to the board of the player on your right. If you don't, claim the Folklore achievement.`,
    `Splay your yellow cards right, and unsplay your purple cards, or vice versa.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const handCards = game.getZoneByPlayer(player, 'hand').cards()
      const scoreCards = game.getZoneByPlayer(player, 'score').cards()
      const rightPlayer = game.getPlayerRight(player)

      const choices = [...handCards, ...scoreCards]
      const selectedCard = game.aChooseCard(player, choices)

      if (selectedCard) {
        game.aTransfer(player, selectedCard, game.getZoneByPlayer(rightPlayer, selectedCard.color))
      }
      else {
        game.aClaimAchievement(player, { name: 'Folklore' })
      }
    },
    (game, player) => {
      const selected = game.aChoose(player, ['yellow', 'purple'], {
        title: 'Choose a color to splay right',
      })[0]

      if (selected === 'yellow') {
        game.aSplay(player, 'yellow', 'right')
        game.aUnsplay(player, 'purple')
      }
      else {
        game.aSplay(player, 'purple', 'right')
        game.aUnsplay(player, 'yellow')
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
