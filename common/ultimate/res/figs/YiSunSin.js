const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Yi Sun-Sin`  // Card names are unique in Innovation
  this.name = `Yi Sun-Sin`
  this.color = `red`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `4hf&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Score a top card with a {k} from anywhere.`
  this.karma = [
    `If you would score a card of a color you have splayed, instead tuck it, then draw a {3}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const choices = game
      .getTopCardsAll()
      .filter(card => card.checkHasBiscuit('k'))
    game.aChooseAndScore(player, choices)
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'score',
      kind: 'would-instead',
      matches(game, player, { card }) {
        const zone = game.getZoneByPlayer(player, card.color)
        return zone.splay !== 'none'
      },
      func: (game, player, { card }) => {
        game.aTuck(player, card)
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
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
