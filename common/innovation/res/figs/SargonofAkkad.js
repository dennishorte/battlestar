const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sargon of Akkad`  // Card names are unique in Innovation
  this.name = `Sargon of Akkad`
  this.color = `green`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `1ch*`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw and meld a {1}.`
  this.echo = ``
  this.karma = [
    `If you would meld a card, and your current top card of that color is of equal value, instead tuck it.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 1))
  }
  this.karmaImpl = [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const cards = game.getCardsByZone(player, card.color)
        return cards.length > 0 && cards[0].age === card.age
      },
      func: (game, player, { card }) => {
        game.aTuck(player, card)
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
