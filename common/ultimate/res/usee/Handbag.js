const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Handbag`  // Card names are unique in Innovation
  this.name = `Handbag`
  this.color = `green`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hcic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may choose to either transfer your bottom card of each color to your hand, or tuck all cards from your score pile, or choose a value and score all cards from your hand of that value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = [
        'Transfer bottom cards to hand',
        'Tuck score pile',
        'Score cards of chosen value from hand'
      ]
      
      const choice = game.aChoose(player, choices)

      if (choice === choices[0]) {
        // Transfer bottom cards
        game.getColorsInPlay().forEach(color => {
          const cards = game.getCardsByZone(player, color)
          if (cards.length > 0) {
            game.aTransfer(player, cards[cards.length - 1], game.getZoneByPlayer(player, 'hand'))
          }
        })
      }
      else if (choice === choices[1]) {
        // Tuck score pile  
        const cards = game.getCardsByZone(player, 'score')
        game.aTuckMany(player, cards)
      } 
      else if (choice === choices[2]) {
        // Score cards of chosen value
        const values = game.getCardsByZone(player, 'hand').map(c => c.age)
        const value = game.aChooseAge(player, values)
        
        const toScore = game.getCardsByZone(player, 'hand').filter(c => c.age === value)
        game.aScoreMany(player, toScore)
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