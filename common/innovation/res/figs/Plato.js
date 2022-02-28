const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Plato`  // Card names are unique in Innovation
  this.name = `Plato`
  this.color = `purple`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `shs*`
  this.dogmaBiscuit = `s`
  this.inspire = `You may splay one color of your cards left.`
  this.echo = ``
  this.karma = [
    `You may issue a Rivalry Decree with any two figures.`,
    `Each splayed stack on your board provides one additional {k}, {s}, {l}, and {c}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndSplay(player, null, 'left')
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'calculate-biscuits',
      func(game, player) {
        const numSplayed = game
          .utilColors()
          .map(color => game.getZoneByPlayer(player, color))
          .filter(zone => zone.splay !== 'none')
          .length

        const biscuits = game.utilEmptyBiscuits()
        biscuits.k = numSplayed
        biscuits.s = numSplayed
        biscuits.l = numSplayed
        biscuits.c = numSplayed

        return biscuits
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
