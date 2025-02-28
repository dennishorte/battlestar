const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Heirloom`  // Card names are unique in Innovation
  this.name = `Heirloom`
  this.color = `yellow`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `fcfh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer one of your secrets to the available achievements and draw a card of value one higher than the transferred card. If you don't, safeguard an available achievement of value equal to the value of your top red card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const secrets = game.getCardsByZone(player, 'secrets')
      const transferred = game.aChooseAndTransfer(player, secrets, game.getZoneById('achievements'), { count: 1, transferTail: false })[0]
      
      if (transferred) {
        game.aDraw(player, transferred.getAge() + 1)
      } else {
        const topRed = game.getTopCard(player, 'red')
        if (topRed) {
          const value = topRed.getAge() 
          const available = game.getAvailableAchievements()
          const achievement = available.find(card => card.getAge() === value)
          if (achievement) {
            game.mSafeguard(player, achievement)
          }
        }
      }
    },
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