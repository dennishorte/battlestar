const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ruler`  // Card names are unique in Innovation
  this.name = `Ruler`
  this.color = `blue`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `shs&`
  this.dogmaBiscuit = `s`
  this.echo = `Draw a {2}.`
  this.karma = []
  this.dogma = [
    `Draw two Echoes {1}. Foreshadow one of the drawn cards and return the other.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = [
        game.aDraw(player, { age: game.getEffectAge(this, 1), exp: 'echo' }),
        game.aDraw(player, { age: game.getEffectAge(this, 1), exp: 'echo' }),
      ]

      const foreshadowed = game.aChooseCard(player, cards, {
        title: 'Choose a card to foreshadow',
      })

      game.aForeshadow(player, foreshadowed)
      game.aReturn(player, cards.filter(x => x.id !== foreshadowed.id)[0])
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 2) })
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
