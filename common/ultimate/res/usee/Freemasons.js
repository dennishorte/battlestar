const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Freemasons`  // Card names are unique in Innovation
  this.name = `Freemasons`
  this.color = `yellow`
  this.age = 3
  this.expansion = `users`
  this.biscuits = `chck`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each color, you may tuck a card from your hand of that color. If you tuck any yellow or expansion cards, draw two {3}.`,
    `You may splay your yellow or purple cards left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choicesByColor = game
        .utilColors()
        .reduce((choices, color) => ({
          ...choices, 
          [color]: game.getCardsByZone(player, 'hand').filter(c => c.color === color)
        }), {})

      let tuckedYellow = false
      let tuckedExpansion = false

      Object.keys(choicesByColor).forEach(color => {
        const card = game.aChooseCard(player, choicesByColor[color], {
          title: `Choose a ${color} card to tuck`,
          min: 0,
          max: 1
        })
        if (card) {
          game.aTuck(player, card)
          if (card.color === 'yellow') tuckedYellow = true
          if (game.isCardExpansion(card)) tuckedExpansion = true
        }
      })

      if (tuckedYellow || tuckedExpansion) {
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'purple'], 'left')
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