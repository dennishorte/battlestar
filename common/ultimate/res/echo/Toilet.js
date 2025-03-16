const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Toilet`  // Card names are unique in Innovation
  this.name = `Toilet`
  this.color = `purple`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `&lhl`
  this.dogmaBiscuit = `l`
  this.echo = `Draw and tuck a {4}.`
  this.karma = []
  this.dogma = [
    `I demand you return all cards from your score pile of value matching the highest bonus on my board!`,
    `You may return a card in your hand and draw a card of the same value.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const age = game
        .getBonuses(leader)
        .sort((l, r) => r - l)[0]
      const toReturn = game
        .getCardsByZone(player, 'score')
        .filter(card => card.age === age)

      game.aReturnMany(player, toReturn)
    },

    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), {
        title: 'Choose a card to cycle',
        min: 0,
        max: 1
      })
      if (returned.length > 0) {
        game.aDraw(player, { age: returned[0].getAge() })
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 4))
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
