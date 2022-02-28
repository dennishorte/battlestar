const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ludwig Van Beethoven`  // Card names are unique in Innovation
  this.name = `Ludwig Van Beethoven`
  this.color = `purple`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `h*7c`
  this.dogmaBiscuit = `c`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.karma = [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would score a card with a {s}, instead return it and all cards from your score pile, then draw and score four {5}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry'
    },
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.biscuits.includes('s'),
      func: (game, player, { card }) => {
        const toReturn = game.getCardsByZone(player, 'score')
        toReturn.push(card)
        game.aReturnMany(player, toReturn)
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
