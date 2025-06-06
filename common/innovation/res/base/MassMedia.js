const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mass Media`  // Card names are unique in Innovation
  this.name = `Mass Media`
  this.color = `green`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `shis`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you do, choose a value and return all cards of that value from all score piles.`,
    `You may splay your purple cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
      if (cards && cards.length > 0) {
        const age = game.aChooseAge(player)
        game.log.add({
          template: '{player} chooses age {age}',
          args: { player, age }
        })
        game.log.indent()
        const toReturn = game
          .players.all()
          .flatMap(player => game.getCardsByZone(player, 'score'))
          .filter(card => card.getAge() === age)
        game.aReturnMany(player, toReturn)
        game.log.outdent()
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
    },
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
