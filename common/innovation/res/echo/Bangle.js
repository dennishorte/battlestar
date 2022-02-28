const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bangle`  // Card names are unique in Innovation
  this.name = `Bangle`
  this.color = `red`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hk&1`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = [`Tuck a red card from your hand.`]
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a {2}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 2))
    }
  ]
  this.echoImpl = [
    (game, player) => {
      const redCards = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .filter(card => card.color === 'red')
        .map(c => c.id)

      const card = game.aChooseCard(player, redCards)

      if (card) {
        game.aTuck(player, card)
      }
    }
  ]
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
