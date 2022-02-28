const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Composites`  // Card names are unique in Innovation
  this.name = `Composites`
  this.color = `red`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `ffhf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all but one card from your hand to my hand! Also, transfer the highest card from your score pile to my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const cards = game.getCardsByZone(player, 'hand')
      const count = cards.length - 1
      game.aChooseAndTransfer(player, cards, game.getZoneByPlayer(leader, 'hand'), { count })

      const highestScore = game.utilHighestCards(
        game.getCardsByZone(player, 'score')
      )
      game.aChooseAndTransfer(player, highestScore, game.getZoneByPlayer(leader, 'score'))
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
