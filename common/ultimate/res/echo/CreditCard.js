const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Credit Card`  // Card names are unique in Innovation
  this.name = `Credit Card`
  this.color = `green`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `&c9h`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {9}.`
  this.karma = []
  this.dogma = [
    `You may take a top non-green card from your board into your hand. If you do, draw and score a card of equal value.`,
    `You may splay your green cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.color !== 'green')
      const card = game.aChooseCard(player, choices, {
        min: 0,
        max: 1,
        title: 'You may take a card into your hand.'
      })

      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(player, 'hand'))
        game.aDrawAndScore(player, card.getAge())
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'up')
    },
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 9))
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
