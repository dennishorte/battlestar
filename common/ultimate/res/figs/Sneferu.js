const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sneferu`  // Card names are unique in Innovation
  this.name = `Sneferu`
  this.color = `yellow`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `hkk*`
  this.dogmaBiscuit = `k`
  this.inspire = `Draw and tuck a {2}. If it has a {k}, repeat this effect.`
  this.echo = ``
  this.karma = [
    `You may issue an Expansion decree with any two figures.`,
    `Each {k} on your board provides one additional {c}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    while (true) {
      const card = game.aDrawAndTuck(player, game.getEffectAge(this, 2))
      if (!card.checkHasBiscuit('k')) {
        break
      }
    }
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion'
    },
    {
      trigger: 'calculate-biscuits',
      func(game, player, { biscuits }) {
        const output = game.utilEmptyBiscuits()
        output.c = biscuits.k
        return output
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
