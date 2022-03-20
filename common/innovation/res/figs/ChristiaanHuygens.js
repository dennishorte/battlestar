const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Christiaan Huygens`  // Card names are unique in Innovation
  this.name = `Christiaan Huygens`
  this.color = `blue`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `&ssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {7}, {8}, {9}, or {0}.`
  this.karma = [
    `If you would foreshadow a card, instead meld it if it both has a {i} and its value is no more than two higher than your highest top card. Otherwise, foreshadow it.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const age = game.aChooseAge(player, [
      game.getEffectAge(this, 7),
      game.getEffectAge(this, 8),
      game.getEffectAge(this, 9),
      game.getEffectAge(this, 10),
    ])
    game.aDrawAndForeshadow(player, age)
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'foreshadow',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        const biscuitCondition = card.biscuits.includes('i')
        const ageCondition = card.age <= game.getHighestTopAge(player) + 2

        if (biscuitCondition && ageCondition) {
          game.aMeld(player, card)
        }
        else {
          game.aForeshadow(player, card)
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
