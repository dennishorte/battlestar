const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `John Harrison`  // Card names are unique in Innovation
  this.name = `John Harrison`
  this.color = `green`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `6ch*`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw a {6}.`
  this.echo = ``
  this.karma = [
    `You may issue a Trade Decree with any two figures.`,
    `If an opponent would draw a card for sharing, first draw a {6}. You may choose the type of card drawn.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 6) })
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Trade'
    },
    {
      trigger: 'draw',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { share }) => {
        const owner = game.getPlayerByCard(this)
        const isOpponentCondition = game.getPlayerOpponents(owner).includes(player)
        return isOpponentCondition && share
      },
      func: (game, player) => {
        const owner = game.getPlayerByCard(this)
        const kind = game.aChoose(owner, game.getExpansionList())[0]
        game.aDraw(owner, { exp: kind, age: game.getEffectAge(this, 6) })
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
