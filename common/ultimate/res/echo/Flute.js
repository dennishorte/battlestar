const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Flute`  // Card names are unique in Innovation
  this.name = `Flute`
  this.color = `purple`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `1mc&`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `You may splay one color of your cards left.`
  this.karma = []
  this.dogma = [
    `I demand you return a card with a bonus from your hand!`,
    `Draw and reveal a {1}. If it has a bonus, draw a {1}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBonus())
      game.aChooseAndReturn(player, choices)
    },

    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 1))
      if (card && card.checkHasBonus()) {
        game.aDraw(player, { age: game.getEffectAge(this, 1) })
      }
    },
  ]
  this.echoImpl = (game, player) => {
    game.aChooseAndSplay(player, null, 'left')
  }
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
