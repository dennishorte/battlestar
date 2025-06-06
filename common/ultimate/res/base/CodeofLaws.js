const CardBase = require(`../CardBase.js`)
function Card() {
  this.id = `Code of Laws`  // Card names are unique in Innovation
  this.name = `Code of Laws`
  this.color = `purple`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hccl`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may tuck a card from your hand of the same color as any card on your board. If you do, you may splay that color of your cards left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const boardColors = game
        .getTopCards(player)
        .map(card => card.color)

      const choices = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .filter(card => boardColors.includes(card.color))

      const tucked = game.aChooseAndTuck(player, choices, { min: 0, max: 1 })

      if (tucked && tucked.length > 0) {
        const color = tucked[0].color
        game.aChooseAndSplay(player, [color], 'left')
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
