const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shuriken`  // Card names are unique in Innovation
  this.name = `Shuriken`
  this.color = `red`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top non-red card with a {k} or {s} from your board to my board! If you do, draw a {4}.`,
    `You may splay your purple cards right.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.color !== 'red')
        .filter(card => card.checkHasBiscuit('k') || card.checkHasBiscuit('s'))
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        const transferred = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
        if (transferred) {
          game.aDraw(player, { age: game.getEffectAge(this, 4) })
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'right')
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
