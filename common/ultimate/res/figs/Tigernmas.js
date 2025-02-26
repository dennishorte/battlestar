const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tigernmas`  // Card names are unique in Innovation
  this.name = `Tigernmas`
  this.color = `red`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `hl*l`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw a {1}.`
  this.echo = ``
  this.karma = [
    `You may issue a War Decree with any two figures.`,
    `Each card in your hand provides one additional point toward your score.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 1) })
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        return game.getCardsByZone(player, 'hand').length
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
