const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dance`  // Card names are unique in Innovation
  this.name = `Dance`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer a top card on your board with [l] to the board of any other player. If you do, meld the lowest top card without [l] from that player's board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('l'))
      
      const card = game.aChooseCard(player, choices)
      if (card) {
        const otherPlayers = game
          .getPlayerOpponents(player)

        const targetPlayer = game.aChoosePlayer(player, otherPlayers)
        game.aTransfer(player, card, game.getZoneByPlayer(targetPlayer, card.color))

        const meldChoices = game  
          .getTopCards(targetPlayer)
          .filter(card => !card.checkHasBiscuit('l'))
          
        const meldCard = game.aChooseCard(player, meldChoices, { 
          title: 'Choose card to meld',
          lowest: true
        })
        
        if (meldCard) {
          game.aMeld(targetPlayer, meldCard)
        }
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