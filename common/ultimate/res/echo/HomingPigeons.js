const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Homing Pigeons`  // Card names are unique in Innovation
  this.name = `Homing Pigeons`
  this.color = `green`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `3lhl`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return two cards from your score pile whose values each match at least one card in my hand!`,
    `You may splay your red or green cards left.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const ages = game
        .getCardsByZone(leader, 'hand')
        .map(card => card.getAge())
      const choices = game
        .getCardsByZone(player, 'score')
        .filter(card => ages.includes(card.getAge()))
      game.aChooseAndReturn(player, choices, { count: 2 })
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green', 'red'], 'left')
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
