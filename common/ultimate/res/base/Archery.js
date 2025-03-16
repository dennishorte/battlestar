const CardBase = require(`../CardBase.js`)
function Card() {
  this.id = `Archery`  // Card names are unique in Innovation
  this.name = `Archery`
  this.color = `red`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kshk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw a {1}, then transfer the highest card in your hand to my hand!`,
    `Junk an available achievement of value 1 or 2.`
  ]
  this.dogmaImpl = [
    (game, player, { leader }) => {
      game.aDraw(player, { age: game.getEffectAge(this, 1) })
      const highest = game.aChooseHighest(player, game.getCardsByZone(player, 'hand'), 1)
      if (highest.length > 0) {
        game.aTransfer(player, highest[0], game.getZoneByPlayer(leader, 'hand'))
      }
    },
    (game, player) => {
      game.aJunkAvailableAchievement(player, [1, 2])
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
