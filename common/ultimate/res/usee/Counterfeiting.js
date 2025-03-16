const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Counterfeiting`  // Card names are unique in Innovation
  this.name = `Counterfeiting`
  this.color = `green`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `scch`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score a top card from your board of a value not in your score pile. If you do, repeat this effect.`,
    `You may splay your green or purple cards left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const agesInScore = game.getCardsByZone(player, 'score').map(c => c.getAge())
        const canScore = game.getTopCards(player).filter(c => !agesInScore.includes(c.getAge()))
        const scored = game.aChooseAndScore(player, canScore, { count: 1 })[0]
        if (scored) {
          continue
        }
        else {
          break
        }
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['green', 'purple'], 'left')
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
