const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Order of the Occult Hand`  
  this.name = `Order of the Occult Hand`
  this.color = `purple`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `hfss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have a {3} in your score pile, you lose.`,
    `If you have a {7} in your hand, you win.`,
    `Meld two cards from your hand. Score four cards from your hand. Splay your blue cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hasAge3 = game
        .getCardsByZone(player, 'score')
        .some(card => card.age === 3)
      
      if (hasAge3) {
        throw new GameOverEvent({
          player: game.getPlayerOpponents(player)[0], // Opponent wins
          reason: this.name
        })
      }
    },
    (game, player) => {
      const hasAge7 = game  
        .getCardsByZone(player, 'hand')
        .some(card => card.age === 7)

      if (hasAge7) {
        throw new GameOverEvent({
          player,
          reason: this.name  
        })
      }
    },
    (game, player) => {
      const choices = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        
      game.aChooseAndMeld(player, choices, { count: 2 })
      game.aChooseAndScore(player, choices, { count: 4 })
      game.aSplay(player, 'blue', 'up')
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