const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Iron Curtain`  // Card names are unique in Innovation
  this.name = `Iron Curtain`
  this.color = `red`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hlhl`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Unsplay each splayed color on your board. For each color you unsplay, return your top card of that color and safeguard an available standard achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const splays = ['yellow', 'red', 'purple', 'green', 'blue']
        .filter(color => game.getZoneByPlayer(player, color).splay !== 'none')

      const unsplayed = []
      for (const color of splays) {
        unsplayed.push(game.aUnsplay(player, color))
      }

      const toReturn = unsplayed
        .filter(color => color)
        .map(color => game.getTopCard(player, color))

      game.aReturnMany(player, toReturn)
      game.aChooseAndSafeguard(player, game.getAvailableStandardAchievements(player), {
        count: toReturn.length,
        hidden: true
      })
    },
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
