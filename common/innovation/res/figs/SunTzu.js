const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sun Tzu`  // Card names are unique in Innovation
  this.name = `Sun Tzu`
  this.color = `red`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `*khk`
  this.dogmaBiscuit = `k`
  this.inspire = `Draw a {2}.`
  this.echo = ``
  this.karma = [
    `You may issue a War Decree with any two figures.`,
    `If you would draw for a share bonus, first meld any number of cards from your hand matching the Dogma action's featured biscuit.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 2) })
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { share }) => share,
      func: (game, player, { featuredBiscuit }) => {
        const choices = game
          .getCardsByZone(player, 'hand')
          .filter(card => card.dogmaBiscuit === featuredBiscuit)
        game.aChooseAndMeld(player, choices, { min: 0, max: choices.length })
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
