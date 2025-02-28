const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `El Dorado`  // Card names are unique in Innovation
  this.name = `El Dorado`
  this.color = `green` 
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {4}, a {2}, and a {1}. If all three cards have c, score all cards in the {4} deck. If at least two have c, splay your green and blue cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      // Draw and meld the three cards
      const card4 = game.aDrawAndMeld(player, game.getEffectAge(this, 4))
      const card2 = game.aDrawAndMeld(player, game.getEffectAge(this, 2))
      const card1 = game.aDrawAndMeld(player, game.getEffectAge(this, 1))
      
      // Check if all three cards have a crown
      const allCrowns = [card4, card2, card1].every(card => card.checkHasBiscuit('c'))

      if (allCrowns) {
        // Score the entire age 4 deck
        const deck4 = game.getCardsByZone(game.getZoneById('deck4'))
        game.aScoreMany(player, deck4)
      }

      // Check if at least two cards have a crown  
      const crownCount = [card4, card2, card1].filter(card => card.checkHasBiscuit('c')).length
      if (crownCount >= 2) {
        // Splay green and blue right
        game.aSplay(player, 'green', 'right')
        game.aSplay(player, 'blue', 'right') 
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