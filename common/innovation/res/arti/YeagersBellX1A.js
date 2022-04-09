const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Yeager's Bell X-1A`  // Card names are unique in Innovation
  this.name = `Yeager's Bell X-1A`
  this.color = `blue`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `iifh`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {9}. Execute the effects of the melded card as if they were on this card, without sharing. If that card has a {i}, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.aDrawAndMeld(player, game.getEffectAge(this, 9))
        game.aExecuteAsIf(player, card)

        if (card.checkHasBiscuit('i')) {
          game.mLog({ template: 'Card had an {i}.' })
          continue
        }
        else {
          game.mLog({ template: 'Card did not have an {i}.' })
          break
        }
      }
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
