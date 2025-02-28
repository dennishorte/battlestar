const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Silk`  // Card names are unique in Innovation
  this.name = `Silk`
  this.color = `yellow`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `cclh`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand.`,
    `You may score a card from your hand of each color on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.getCardsByZone(player, 'hand')
      game.aChooseAndMeld(player, cards) 
    },
    (game, player) => {
      const boardColors = game
        .getTopCards(player)
        .map(card => card.color)

      const choices = game  
        .getCardsByZone(player, 'hand')
        .filter(card => boardColors.includes(card.color))

      const colorChoices = {}
      choices.forEach(card => {
        if (!colorChoices[card.color]) {
          colorChoices[card.color] = []
        }
        colorChoices[card.color].push(card)
      })

      Object.entries(colorChoices).forEach(([color, cards]) => {
        game.aChooseAndScore(player, cards, { min: 0, max: 1 })
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