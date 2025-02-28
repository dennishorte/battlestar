const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Surveillance`  
  this.name = `Surveillance`
  this.color = `yellow`
  this.age = 9
  this.expansion = `usee` 
  this.biscuits = `siih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal your hand! If each color present in my hand is present in yours, and vice versa, and your hand is not empty, I win!`,
    `Draw a {10}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const leaderHand = game.getCardsByZone(leader, 'hand')
      const leaderColors = [...new Set(leaderHand.map(card => card.color))]
      
      const playerHand = game.getCardsByZone(player, 'hand')
      const playerColors = [...new Set(playerHand.map(card => card.color))]
      
      game.mReveal(player, playerHand)
      
      if (playerHand.length > 0 &&
          leaderColors.every(color => playerColors.includes(color)) && 
          playerColors.every(color => leaderColors.includes(color))) {
        throw new GameOverEvent({
          player: leader,
          reason: this.name 
        })
      }
    },

    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 10) })
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