const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Susan Blackmore`  // Card names are unique in Innovation
  this.name = `Susan Blackmore`
  this.color = `blue`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `*shs`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = [
    `If another player would not draw a share bonus after a Dogma action, first transfer the card they activated to your score pile.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.karmaImpl = [
    {
      trigger: 'no-share',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player) => {
        return player === game.getPlayerByCard(this)
      },
      func: (game, player, { card }) => {
        game.aTransfer(player, card, game.getZoneByPlayer(player, 'score'))
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
