const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ruth Handler`  // Card names are unique in Innovation
  this.name = `Ruth Handler`
  this.color = `yellow`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `9*hf`
  this.dogmaBiscuit = `f`
  this.inspire = `Transfer a top card from your board to your hand.`
  this.echo = ``
  this.karma = [
    `If you would meld a card, first meld all other cards of that color from your hand, then draw and achieve a {9} for each card you melded in this way, regardless of eligibility.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndTransfer(player, game.getTopCards(player), game.getZoneByPlayer(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const toMeld = game
          .getCardsByZone(player, 'hand')
          .filter(other => other.color === card.color)
          .filter(other => other !== card)
        const melded = game.aMeldMany(player, toMeld)
        for (let i = 0; i < melded.length; i++) {
          const toAchieve = game.aDraw(player, { age: game.getEffectAge(this, 9) })
          game.aClaimAchievement(player, toAchieve)
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
