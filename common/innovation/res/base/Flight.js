const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Flight`  // Card names are unique in Innovation
  this.name = `Flight`
  this.color = `red`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `chic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If your red cards are splayed up, you may splay any one color of your cards up.`,
    `You may splay your red cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const redSplay = game.getZoneByPlayer(player, 'red').splay
      if (redSplay === 'up') {
        game.aChooseAndSplay(player, null, 'up')
      }
      else {
        game.mLog({ template: 'no effect' })
      }
    },
    (game, player) => {
      const redSplay = game.getZoneByPlayer(player, 'red').splay
      if (redSplay === 'up') {
        game.mLog({ template: 'no effect' })
      }
      else {
        game.aChooseAndSplay(player, ['red'], 'up')
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
