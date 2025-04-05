const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shuriken`  // Card names are unique in Innovation
  this.name = `Shuriken`
  this.color = `red`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer two non-red top cards with {k} or {p} of different colors from your board to my board! If you do, and Shuriken was foreseen, transfer them to my achievements!`,
    `You may splay your purple cards right.`
  ]

  this.dogmaImpl = [
    (game, player, { leader, foreseen, self }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.color !== 'red')
        .filter(card => card.checkHasBiscuit('k') || card.checkHasBiscuit('p'))

      let cards = game.aChooseCards(player, choices, { count: 2 })

      if (cards.length > 0) {
        const transferred = []
        while (cards.length > 0) {
          const card = game.aChooseCard(player, cards)
          cards = cards.filter(other => other.id !== card.id)

          const trans = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
          if (trans) {
            transferred.push(trans)
          }
        }

        if (foreseen && transferred.length === 2) {
          game.mLogWasForeseen(self)
          game.aTransferMany(player, transferred, game.getZoneByPlayer(leader, 'achievements'), { ordered: true })
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'right')
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
