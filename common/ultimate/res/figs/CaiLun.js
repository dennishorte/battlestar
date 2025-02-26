const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cai Lun`  // Card names are unique in Innovation
  this.name = `Cai Lun`
  this.color = `yellow`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `&cch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `You may splay one color of your cards left.`
  this.karma = [
    `If you would claim an achievement, first draw and foreshadow a {3}.`,
    `Each card in your forecast counts as an available achievement for you.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, null, 'left')
    }
  ]
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        game.aDrawAndForeshadow(player, game.getEffectAge(this, 3))
      }
    },
    {
      trigger: 'list-achievements',
      func(game, player) {
        return game.getCardsByZone(player, 'forecast')
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
