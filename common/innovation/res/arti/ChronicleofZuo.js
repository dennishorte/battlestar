const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chronicle of Zuo`  // Card names are unique in Innovation
  this.name = `Chronicle of Zuo`
  this.color = `red`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `chss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have the least {k}, draw a {2}. If you have the least {c}, draw a {3}. If you have the least {s}, draw a {4}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const biscuits = game.getBiscuits()
      const castles = game
        .players.opponentsOf(player)
        .map(opp => biscuits[opp.name].k)
        .sort((l, r) => l - r)
      const coins = game
        .players.opponentsOf(player)
        .map(opp => biscuits[opp.name].c)
        .sort((l, r) => l - r)
      const lights = game
        .players.opponentsOf(player)
        .map(opp => biscuits[opp.name].s)
        .sort((l, r) => l - r)

      if (biscuits[player.name].k < castles[0]) {
        game.aDraw(player, { age: game.getEffectAge(this, 2) })
      }

      if (biscuits[player.name].c < coins[0]) {
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
      }

      if (biscuits[player.name].s < lights[0]) {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
      }
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
