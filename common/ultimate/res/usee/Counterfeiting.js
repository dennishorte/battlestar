const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Counterfeiting`  // Card names are unique in Innovation
  this.name = `Counterfeiting`
  this.color = `green`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `scch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score a top card from your board of a value not in your score pile. If you do, repeat this effect.`,
    `You may splay your green or purple cards left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const scoredAges = game
        .getCardsByZone(player, 'score')
        .map(c => c.age)

      const availableAges = game
        .getTopCards(player)
        .map(c => c.age)
        .filter(age => !scoredAges.includes(age))

      while (availableAges.length > 0) {
        const choices = game
          .getTopCards(player)
          .filter(card => availableAges.includes(card.age))
    
        const card = game.aChooseCard(player, choices)
        
        if (!card) break

        game.aScore(player, card)
        availableAges.splice(availableAges.indexOf(card.age), 1)
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['green', 'purple'], 'left')
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