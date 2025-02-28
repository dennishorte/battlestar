const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Secret Police`  // Card names are unique in Innovation
  this.name = `Secret Police`
  this.color = `yellow`
  this.age = 3
  this.expansion = `base` // Corrected expansion 
  this.biscuits = `kkkh`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you tuck a card in your hand, then return your top card of its color! If you do, repeat this effect! Otherwise, draw a {1}!`,
    `You may tuck any number of cards of any one color from your hand.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      while (true) {
        const tuckedCard = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
        
        if (tuckedCard.length > 0) {
          const topCard = game.getTopCard(player, tuckedCard[0].color)
          if (topCard) {
            game.aReturnSingle(player, topCard)
          } else {
            break  
          }
        } else {
          game.aDraw(player, { age: game.getEffectAge(this, 1) })
          break
        }
      }
    },
    (game, player) => {
      const colors = ['red', 'blue', 'yellow', 'purple', 'green']
      const colorName = game.aChoose(player, colors, { title: 'Choose a color' })[0]

      const cards = game
        .getCardsByZone(player, 'hand')
        .filter(c => c.color === colorName)

      game.aTuckMany(player, cards)
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