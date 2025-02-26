const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Christopher Polhem`  // Card names are unique in Innovation
  this.name = `Christopher Polhem`
  this.color = `yellow`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `hff*`
  this.dogmaBiscuit = `f`
  this.inspire = `Draw and tuck a {4}.`
  this.echo = ``
  this.karma = [
    `You may issue an Expansion Decree with any two figures.`,
    `Each {f} on your board provides two additional points towards your score.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 4))
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        return game.getBiscuitsByPlayer(player).f * 2
      }
    },
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
