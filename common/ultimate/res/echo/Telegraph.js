const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Telegraph`  // Card names are unique in Innovation
  this.name = `Telegraph`
  this.color = `green`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `hiis`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may choose an opponent and a color. Match your splay in that color to theirs.`,
    `You may splay your blue cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getPlayerAll()
        .filter(other => other !== player)
        .flatMap(other => game.utilColors().map(color => ({ color, splay: game.getZoneByPlayer(other, color).splay })))
        .filter(x => game.getZoneByPlayer(player, x.color) !== x.splay)
        .map(x => `${x.color} ${x.splay}`)
      const distinct = util.array.distinct(choices).sort()

      const choice = game.aChoose(player, distinct, { min: 0, max: 1 })[0]
      if (choice) {
        const [color, direction] = choice.split(' ')
        game.aSplay(player, color, direction)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'up')
    },
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
