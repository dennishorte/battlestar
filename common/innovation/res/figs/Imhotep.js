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
  this.echoImpl = [
    {
      dogma: `Draw and meld a {2}.`,
      steps: [
        {
          description: `Draw and meld a {2}.`,
          func(context, player) {
            const { game } = context
            return game.aDrawAndMeld(context, player, 2)
          }
        }
      ]
    }
  ]
  this.inspireImpl = []
  this.karmaImpl = [
    {
      dogma: `If you would meld a card over an unsplayed color with more than one card, instead splay that color left and return the card.`,
      trigger: 'meld',
      kind: 'would-instead',
      checkApplies(game, player, { card }) {
        card = game.getCardData(card)
        const zone = game.getZoneColorByPlayer(player, card.color)
        return zone.splay === 'none' && zone.cards.length > 1
      },
      steps: [
        {
          description: 'Splay that color left',
          func(context, player, { card }) {
            const { game } = context
            card = game.getCardData(card)
            return game.aSplay(context, player, card.color, 'left')
          },
        },
        {
          description: 'Return the card.',
          func(context, player, { card }) {
            const { game } = context
            return game.aReturn(context, player, card)
          },
        },
      ]
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
