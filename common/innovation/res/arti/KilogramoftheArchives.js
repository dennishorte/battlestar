const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Kilogram of the Archives`  // Card names are unique in Innovation
  this.name = `Kilogram of the Archives`
  this.color = `blue`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `fhfs`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Return a top card from your board. If you returned two cards and their values sum to ten, draw and score a {0}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      const top = game.aChooseAndReturn(player, game.getTopCards(player))

      if (hand && top && hand.length > 0 && top.length > 0) {
        const sum = hand[0].getAge() + top[0].getAge()
        if (sum === 10) {
          game.aDrawAndScore(player, game.getEffectAge(this, 10))
        }
        else {
          game.mLog({ template: 'Card values do not sum to 10' })
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
