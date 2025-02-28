const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pantheism`  // Card names are unique in Innovation
  this.name = `Pantheism`
  this.color = `purple`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `hlss` 
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a card from your hand. If you do, draw and tuck a {5}, score all cards on your board of the color of one of the tucked cards, and splay right the color on your board of the other tucked card.`,
    `Draw and tuck a {5}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const handCards = game.getCardsByZone(player, 'hand')
      const tuckedCard = game.aChooseAndTuck(player, handCards, { min: 0, max: 1 })
      
      if (tuckedCard && tuckedCard.length > 0) {
        const drawnCard = game.aTuck(player, game.aDraw(player, game.getEffectAge(this, 5)))
        
        const colorToScore = game.aChoose(player, [tuckedCard[0].color, drawnCard.color], { title: 'Choose a color to score' })[0]
        const cardsToScore = game.getCardsByZone(player, colorToScore)
        game.aScoreMany(player, cardsToScore)

        const colorToSplay = colorToScore === tuckedCard[0].color ? drawnCard.color : tuckedCard[0].color
        game.aSplay(player, colorToSplay, 'right')
      }
    },
    (game, player) => {
      const card = game.aDraw(player, game.getEffectAge(this, 5))
      game.aTuck(player, card)
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