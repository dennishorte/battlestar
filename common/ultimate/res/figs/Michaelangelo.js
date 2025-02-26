const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Michaelangelo`  // Card names are unique in Innovation
  this.name = `Michaelangelo`
  this.color = `yellow`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `ch*c`
  this.dogmaBiscuit = `c`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.karma = [
    `Each card in your hand is also considered part of your score pile.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'list-score',
      func(game, player) {
        return [
          ...game.getZoneByPlayer(player, 'score')._cards,
          ...game.getZoneByPlayer(player, 'hand')._cards,
        ]
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
