const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fashion Mask`  // Card names are unique in Innovation
  this.name = `Fashion Mask`
  this.color = `yellow`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `hlll` 
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a top card with {l} or {p} of each color on your board. You may safeguard one of the tucked cards.`,
    `Score all but the top five each of your yellow and purple cards. Splay those colors aslant.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const validColors = ['blue', 'red', 'green', 'yellow', 'purple']
      const tuckedCards = []
      
      for (const color of validColors) {
        const choices = game
          .getTopCards(player)
          .filter(card => 
            card.color === color && 
            (card.checkHasBiscuit('l') || card.checkHasBiscuit('p'))
          )
        const tucked = game.aChooseAndTuck(player, choices, { min: 0, max: 1 })
        if (tucked.length > 0) {
          tuckedCards.push(tucked[0])
        }
      }
      
      if (tuckedCards.length > 0) {
        game.aChooseAndSafeguard(player, tuckedCards, { min: 0, max: 1 })
      }
    },
    (game, player) => {
      const yellows = game
        .getCardsByZone(player, 'yellow')
        .slice(0, -5)
        
      const purples = game  
        .getCardsByZone(player, 'purple')
        .slice(0, -5)
        
      game.aScoreMany(player, yellows)
      game.aScoreMany(player, purples)
      
      game.aSplay(player, 'yellow', 'aslant')
      game.aSplay(player, 'purple', 'aslant')
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