const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Whataboutism`  // Card names are unique in Innovation
  this.name = `Whataboutism`
  this.color = `purple`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `shps`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top card with a demand effect of each color from your board to my board! If you transfer any cards, exchange all cards in your score pile with all cards in my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const topDemands = game
        .getTopCards(player)
        .filter(card => card.dogma.some(effect => {
          return effect.toLowerCase().startsWith('i demand') || effect.toLowerCase().startsWith('i compel')
        }))

      let transferred = false
      for (const card of topDemands) {
          const result = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color));
          if (result) {
            transferred = true;
          }
      }

      if (transferred) {
        game.aExchangeZones(player, game.getZoneByPlayer(player, 'score'), game.getZoneByPlayer(leader, 'score'))
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
