const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jiskairumoko Necklace`  // Card names are unique in Innovation
  this.name = `Jiskairumoko Necklace`
  this.color = `green`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hckk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return a card from your score pile! if you do, transfer an achievement of the same value from your achievements to mine!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        const choices = game
          .getCardsByZone(player, 'achievements')
          .filter(ach => ach.age === card.age)
        game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'achievements'))
      }
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
