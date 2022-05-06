const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Umbrella`  // Card names are unique in Innovation
  this.name = `Umbrella`
  this.color = `green`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `llh&`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `You may meld a card from your hand.`
  this.karma = []
  this.dogma = [
    `Return any numer of cards from your hand. Score two cards from your hand for every card you returned.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 999 })
      const scoreCount = returned.length * 2
      game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'), { count: scoreCount })
    }
  ]
  this.echoImpl = (game, player) => {
    game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
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
