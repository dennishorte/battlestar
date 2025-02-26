const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cristopher Columbus`  // Card names are unique in Innovation
  this.name = `Cristopher Columbus`
  this.color = `green`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `4lh*`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw a {4}.`
  this.echo = ``
  this.karma = [
    `You may issue a Trade Decree with any two figures.`,
    `Each {f} on your board provides two additional {c}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 4) })
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const extra = game.utilEmptyBiscuits()
        extra.c = biscuits.f * 2
        return extra
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
