const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Crossword`  // Card names are unique in Innovation
  this.name = `Crossword`
  this.color = `purple`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `c8hc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each visible bonus on your board, draw a card of that value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const remaining = game.getBonuses(player)

      while (remaining.length > 0) {
        const next = game.actions.choose(player, remaining, { title: 'Draw next...' })[0]
        const index = remaining.indexOf(next)
        remaining.splice(index, 1)

        game.aDraw(player, { age: next })
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
