const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Social Network`  // Card names are unique in Innovation
  this.name = `Social Network`
  this.color = `red`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `haii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you choose an icon type! Transfer all top cards without that icon from your board to my score pile!`,
    `If you have fewer {f}, fewer {c}, and fewer {k} than each other player, you win.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const biscuit = game.aChoose(player, ['{k}', '{c}', '{s}', '{l}', '{f}', '{i}'], {
        title: 'Choose a biscuit',
      })[0][1]
      const toTransfer = game
        .getTopCards(player)
        .filter(card => !card.checkHasBiscuit(biscuit))
      game.aTransferMany(player, toTransfer, game.getZoneByPlayer(leader, 'score'))
    },

    (game, player) => {
      const mine = game.getBiscuitsByPlayer(player)
      const theirs = game
        .getPlayerAll()
        .filter(other => other !== player)
        .map(other => game.getBiscuitsByPlayer(other))

      for (const biscuits of theirs) {
        if (mine.f >= biscuits.f || mine.c >= biscuits.c || mine.k >= biscuits.k) {
          game.log.addNoEffect()
          return
        }
      }

      throw new GameOverEvent({
        player,
        reason: this.name
      })
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
