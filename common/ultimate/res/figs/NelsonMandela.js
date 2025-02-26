const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Nelson Mandela`  // Card names are unique in Innovation
  this.name = `Nelson Mandela`
  this.color = `red`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `l*hl`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw and meld a {9}.`
  this.echo = ``
  this.karma = [
    `If you are required to fade a figure, instead do nothing.`,
    `Each two inspire effects visibile on your board counts as an achievement.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 9))
  }
  this.karmaImpl = [
    {
      trigger: 'no-fade'
    },
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const visibleInspires = game
          .utilColors()
          .flatMap(color => game.getCardsByZone(player, color))
          .filter(card => game.checkInspireIsVisible(card))
          .length
        return Math.floor(visibleInspires / 2)
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
