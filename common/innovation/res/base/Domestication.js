const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Domestication`  // Card names are unique in Innovation
  this.name = `Domestication`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kchk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld the lowest card in your hand. Draw a {1}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game.aChooseLowest(player, game.getCardsByZone(player, 'hand'), 1)
      if (choices && choices.length > 0) {
        game.aMeld(player, choices[0])
      }
      game.aDraw(player, { age: game.getEffectAge(this, 1) })
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
