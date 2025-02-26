const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Catherine the Great`  // Card names are unique in Innovation
  this.name = `Catherine the Great`
  this.color = `purple`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `*ssh`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw and meld a {6}.`
  this.echo = ``
  this.karma = [
    `Each {s} on your board provides two additional {s}.`,
    `If you would meld a purple card, first transfer your top purple card into your hand.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 6))
  }
  this.karmaImpl = [
    {
      trigger: 'calculate-biscuits',
      func(game, player, { biscuits }) {
        const extra = game.utilEmptyBiscuits()
        extra.s = biscuits.s * 2
        return extra
      }
    },

    {
      trigger: 'meld',
      matches(game, player, { card }) {
        return card.color === 'purple'
      },
      func(game, player) {
        const card = game.getTopCard(player, 'purple')
        game.aTransfer(player, card, game.getZoneByPlayer(player, 'hand'))
      },
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
