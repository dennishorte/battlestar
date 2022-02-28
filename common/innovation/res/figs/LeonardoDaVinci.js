const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Leonardo Da Vinci`  // Card names are unique in Innovation
  this.name = `Leonardo Da Vinci`
  this.color = `yellow`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `&5hl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Score a top figure with a bonus from anywhere.`
  this.karma = [
    `If you would meld a yellow card, first meld every non-yellow, non-purple card in your hand.`,
    `If you would meld a purple card, first draw three {4}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const choices = game
      .getPlayerAll()
      .flatMap(player => game.getTopCards(player))
      .filter(card => card.expansion === 'figs')
      .filter(card => card.checkHasBonus())
    game.aChooseAndScore(player, choices)
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: (game, player, { card }) => card.color === 'yellow',
      func: (game, player) => {
        const toMeld = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.color !== 'yellow' && card.color !== 'purple')
        game.aMeldMany(player, toMeld)
      }
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: (game, player, { card }) => card.color === 'purple',
      func: (game, player) => {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
      }
    },
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
