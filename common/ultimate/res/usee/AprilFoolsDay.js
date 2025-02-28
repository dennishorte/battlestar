const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `April Fool's Day`  // Card names are unique in Innovation
  this.name = `April Fool's Day`
  this.color = `yellow`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hsll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
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
      const rightPlayer = game.getPlayerRightOf(player)
      
      const choices = ['hand', 'score']
      const source = game.aChoose(player, choices, { title: 'Choose zone to transfer card from' })
      
      let selectedCard = null
      if (source === 'hand') {
        selectedCard = game.aChooseCard(player, handCards)
      } else {
        selectedCard = game.aChooseCard(player, scoreCards)
      }

      if (selectedCard) {
        game.aTransfer(player, selectedCard, game.getBoard(rightPlayer, selectedCard.color))
      } else {
        game.aClaimAchievement(player, { name: 'Folklore' })
      }
    },
    (game, player) => {
      const yellowSplay = game.getZoneByPlayer(player, 'yellow').splay
      const purpleSplay = game.getZoneByPlayer(player, 'purple').splay

      const choices = []
      if (yellowSplay !== 'right') {
        choices.push('yellow')
      }
      if (purpleSplay !== 'none') {
        choices.push('purple')  
      }

      const selected = game.aChoose(player, choices, { title: 'Choose color to splay' })

      if (selected === 'yellow') {
        game.aSplay(player, 'yellow', 'right')
        game.aUnsplay(player, 'purple')
      } else if (selected === 'purple') {
        game.aUnsplay(player, 'yellow')
        game.aSplay(player, 'purple', 'right')
      } else {
        game.mLogNoEffect()
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