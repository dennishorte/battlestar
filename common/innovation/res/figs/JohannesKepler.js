const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Johannes Kepler`  // Card names are unique in Innovation
  this.name = `Johannes Kepler`
  this.color = `blue`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `hs&s`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {5}.`
  this.karma = [
    `If you would take a Dogma action, first reveal all cards of the chosen card's color from your hand. Increase each {} value in any effect during this action by the number of cards you revealed.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 5) })
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const matchingCards = game
          .getCardsByZone(player, 'hand')
          .filter(other => other.color === card.color)

        matchingCards.forEach(card => game.mReveal(player, card))
        game.state.dogmaInfo.globalAgeIncrease = matchingCards.length
        game.mLog({
          template: 'All {} values increased by {value} during this dogma action',
          args: {
            value: matchingCards.length
          }
        })
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
