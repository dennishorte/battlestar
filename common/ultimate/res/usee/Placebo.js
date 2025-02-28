const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Placebo`  // Card names are unique in Innovation
  this.name = `Placebo`
  this.color = `blue`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `ssfh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a top card on your board, then you may repeat as many times as you want with the same color. Draw a {6} for each card you return. If you return exactly one {6}, draw an {8}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topCards = game.getTopCards(player)
      
      let returnedCards = []
      let color = null
      
      while (true) {
        const choices = color 
          ? topCards.filter(card => card.color === color)
          : topCards

        if (choices.length === 0) {
          break
        }
        
        const card = game.aChooseAndReturn(player, choices, { min: 0, max: 1 })[0]
        
        if (!card) {
          break
        }

        returnedCards.push(card)
        color = color || card.color
      }

      returnedCards.forEach(() => {
        game.aDraw(player, { age: game.getEffectAge(this, 6) })
      })

      if (returnedCards.length === 1 && returnedCards[0].getAge() === 6) {
        game.aDraw(player, { age: game.getEffectAge(this, 8) })
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