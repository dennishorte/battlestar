const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Homer`  // Card names are unique in Innovation
  this.name = `Homer`
  this.color = `purple`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `h*2k`
  this.dogmaBiscuit = `k`
  this.inspire = `Draw and tuck a {2}.`
  this.echo = ``
  this.karma = [
    `If you would remove or return a figure from your hand, instead tuck it.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = [
    (game, player) => {
      game.aDrawAndTuck(player, game.getEffectAge(this, 2))
    }
  ]
  this.karmaImpl = [
    {
      trigger: ['remove', 'return'],
      kind: 'would-instead',
      matches(game, player, { card }) {
        const regex = /players[.].+[.]hand/
        return card.expansion === 'figs' && card.zone.match(regex)
      },
      func(game, player, { card }) {
        return game.aTuck(player, card)
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
