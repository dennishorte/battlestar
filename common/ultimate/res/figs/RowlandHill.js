const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rowland Hill`  // Card names are unique in Innovation
  this.name = `Rowland Hill`
  this.color = `yellow`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `*chc`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw a {7}.`
  this.echo = ``
  this.karma = [
    `If you would claim an achievement, first return three cards from your hand. If you do, claim all other cards in your hand as achievements, ignoring eligibility.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 7) })
  }
  this.karmaImpl = [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), { count: 3})
        if (cards && cards.length === 3) {
          const remaining = game.getCardsByZone(player, 'hand')
          for (const card of remaining) {
            game.aClaimAchievement(player, { card })
          }
        }
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
