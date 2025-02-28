const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Inhomogeneous Cosmology`  // Card names are unique in Innovation
  this.name = `Inhomogeneous Cosmology`
  this.color = `blue`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `ihii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may place a top card from your board on top of its deck. You may meld a card from your hand. If you do either, repeat this effect.`,
    `Draw an {11} for every color not on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const topCards = game.getTopCards(player)
        const handCards = game.getCardsByZone(player, 'hand')
        
        const topCardReturned = game.aChooseAndReturn(player, topCards, { min: 0, max: 1 })[0]
        const handCardMelded = game.aChooseAndMeld(player, handCards, { min: 0, max: 1 })[0]

        if (!topCardReturned && !handCardMelded) {
          break
        }
      }
    },
    (game, player) => {
      const colorsOnBoard = game
        .utilColors()
        .filter(color => game.getCardsByZone(player, color).length > 0)

      const missingColors = game
        .utilColors()
        .filter(color => !colorsOnBoard.includes(color))

      missingColors.forEach(color => {
        game.aDraw(player, { age: game.getEffectAge(this, 11) })
      })
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