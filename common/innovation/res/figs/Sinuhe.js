const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sinuhe`  // Card names are unique in Innovation
  this.name = `Sinuhe`
  this.color = `purple`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `&llh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {2} or {3}.`
  this.karma = [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each {k} on your board provides one additional point towards your score.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = [
    (game, player) => {
      const age = game.aChooseAge(player, [game.getEffectAge(this, 2), game.getEffectAge(this, 3)])
      game.aDrawAndForeshadow(player, age)
    }
  ]
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'calculate-score',
      func(game, player) {
        const biscuits = game.getBiscuitsByPlayer(player)
        return biscuits.k
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
