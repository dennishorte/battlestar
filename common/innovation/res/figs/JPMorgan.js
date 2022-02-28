const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `J.P. Morgan`  // Card names are unique in Innovation
  this.name = `J.P. Morgan`
  this.color = `green`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `c&hc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `You may splay one color of your cards up.`
  this.karma = [
    `You may issue a Trade Decree with any two figures.`,
    `Each biscuit in each color you have splayed up provides an additional biscuit of the same type.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aChooseAndSplay(player, null, 'up')
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Trade'
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player) => {
        let output = game.utilEmptyBiscuits()
        for (const color of game.utilColors()) {
          const zone = game.getZoneByPlayer(player, color)
          if (zone.splay === 'up') {
            const biscuits = game.getBiscuitsByZone(zone)
            output = game.utilCombineBiscuits(output, biscuits)
          }
        }
        return output
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
