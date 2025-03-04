const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Iron Curtain`  // Card names are unique in Innovation
  this.name = `Iron Curtain`
  this.color = `red`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hlhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Unsplay each splayed color on your board. For each color you unsplay, return your top card of that color and safeguard an available standard achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const splays = ['yellow', 'red', 'purple', 'green', 'blue']
        .filter(color => game.getZoneByPlayer(player, color).splay !== 'none')

      for (const color of splays) {
        const zone = game.getZoneByPlayer(player, color)
        const unsplayed = game.aUnsplay(player, color)
        
        if (unsplayed) {
          const topCard = zone.cards().slice(-1)[0]
          if (topCard) {
            game.aReturnTopCard(player, topCard)

            const available = game
              .getAvailableStandardAchievements()
              .filter(ach => ach.isStandard)
            
            if (available.length > 0) {
              const selected = available[0]
              game.aSafeguardAchievement(player, selected)
            }
            else {
              game.mLog({ template: 'no standard achievements available' })
            }
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