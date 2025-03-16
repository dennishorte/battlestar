const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Candles`  // Card names are unique in Innovation
  this.name = `Candles`
  this.color = `red`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `&1hs`
  this.dogmaBiscuit = `s`
  this.echo = `If every other player has a higher score than you, draw a {3}.`
  this.karma = []
  this.dogma = [
    `I demand you transfer a card with a {k} from your hand to my hand! If you do, draw a {1}!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const transferred = game.aChooseAndTransfer(
        player,
        game.getCardsByZone(player, 'hand').filter(card => card.checkHasBiscuit('k')),
        game.getZoneByPlayer(leader, 'hand')
      )
      if (transferred && transferred.length > 0) {
        game.aDraw(player, { age: game.getEffectAge(this, 1) })
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const playerScore = game.getScore(player)
    const otherScores = game
      .getPlayerAll()
      .filter(other => other !== player)
      .map(other => game.getScore(other))
    const isLowest = otherScores.every(score => score > playerScore)
    if (isLowest) {
      game.aDraw(player, { age: game.getEffectAge(this, 3) })
    }
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
