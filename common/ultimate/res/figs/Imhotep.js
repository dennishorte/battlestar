const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Imhotep`  // Card names are unique in Innovation
  this.name = `Imhotep`
  this.color = `blue`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `khk&`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Draw and meld a {2}.`
  this.karma = [
    `If you would meld a card over an unsplayed color with more than one card, instead splay that color left and return the card.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 2))
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const zone = game.getZoneByPlayer(player, card.color)
        return zone.cards().length > 1 && zone.splay === 'none'
      },
      func: (game, player, { card }) => {
        game.aSplay(player, card.color, 'left')
        game.aReturn(player, card)
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
