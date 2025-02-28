const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Urban Legend`  // Card names are unique in Innovation
  this.name = `Urban Legend`
  this.color = `purple`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For every color on your board with {f}, draw a {9}. If you draw five cards, you win.`,
    `You may splay your yellow or purple cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colors = ['red', 'yellow', 'green', 'blue', 'purple']
      let drawnCards = 0
      colors.forEach(color => {
        if (game.getBiscuitsByPlayer(player, color).f > 0) {
          game.aDraw(player, { age: game.getEffectAge(this, 9) })
          drawnCards++
        }
      })

      if (drawnCards >= 5) {
        game.mLogEffect(player, 'drew 5 cards and wins the game', this)
        throw new GameOverEvent({ player })
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'purple'], 'up')
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