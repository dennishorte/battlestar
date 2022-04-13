const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Air Conditioner`  // Card names are unique in Innovation
  this.name = `Air Conditioner`
  this.color = `yellow`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `h&9l`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `You may score a card from your hand.`
  this.karma = []
  this.dogma = [
    `I demand you return all cards from your score pile of value matching any of your top cards!`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topValues = game
        .getTopCards(player)
        .map(card => card.getAge())
      const toReturn = game
        .getCardsByZone(player, 'score')
        .filter(card => topValues.includes(card.getAge()))
      game.aReturnMany(player, toReturn)
    }
  ]
  this.echoImpl = (game, player) => {
    game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
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
