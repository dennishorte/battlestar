const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ptahotep`  // Card names are unique in Innovation
  this.name = `Ptahotep`
  this.color = `purple`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `h*kk`
  this.dogmaBiscuit = `k`
  this.inspire = `Score a top card from your board.`
  this.echo = ``
  this.karma = [
    `If a player would successfully demand something of you, first transfer the highest card from that player's score pile to your score pile.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndScore(player, game.getTopCards(player))
  }
  this.karmaImpl = [
    {
      trigger: 'demand-success',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { leader }) => {
        const highest = game.utilHighestCards(game.getCardsByZone(leader, 'score')).slice(0, 1)
        game.aChooseAndTransfer(player, highest, game.getZoneByPlayer(player, 'score'))
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
