const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Philosophy`  // Card names are unique in Innovation
  this.name = `Philosophy`
  this.color = `purple`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay left any one color of your cards.`,
    `You may score a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, null, 'left')
    },
    (game, player) => {
      const choices = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .map(c => c.name)

      game.aChooseAndScore(player, choices, { min: 0, max: 1 })
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
