const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Muhammad Yunus`  // Card names are unique in Innovation
  this.name = `Muhammad Yunus`
  this.color = `green`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `c*hc`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw a {0}.`
  this.echo = ``
  this.karma = [
    `If any player would take a Dogma action, first you may return a card from your hand. If you do, you have the sole majority in its featured icon until the end of the action.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 10) })
  }
  this.karmaImpl = [
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { owner }) => {
        const returned = game.aChooseAndReturn(
          owner,
          game.getCardsByZone(owner, 'hand'),
          { min: 0, max: 1 }
        )

        if (returned && returned.length > 0) {
          game.mLog({
            template: '{player} has the sole majority',
            args: { player: owner }
          })
          game.state.dogmaInfo.soleMajority = owner
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
