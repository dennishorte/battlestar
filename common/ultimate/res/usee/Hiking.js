const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hiking`  // Card names are unique in Innovation
  this.name = `Hiking`
  this.color = `green`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `llhs`
  this.dogmaBiscuit = `l` 
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {6}. If the top card on your board of the drawn card's color has {l}, tuck the drawn card and draw and reveal a {5}. If the second drawn card has {l}, meld it and draw an {8}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const firstCard = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
      
      if (firstCard) {
        const topCard = game.getTopCard(player, firstCard.color)

        if (topCard && topCard.checkHasBiscuit('l')) {
          game.aTuck(player, firstCard)
          
          const secondCard = game.aDrawAndReveal(player, game.getEffectAge(this, 5))
          
          if (secondCard && secondCard.checkHasBiscuit('l')) {
            game.aMeld(player, secondCard)
            game.aDraw(player, { age: game.getEffectAge(this, 8) })
          }
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