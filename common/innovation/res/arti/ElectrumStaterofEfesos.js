const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Electrum Stater of Efesos`  // Card names are unique in Innovation
  this.name = `Electrum Stater of Efesos`
  this.color = `green`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `chkc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {3}. If you do not have a top card of the drawn card's color, meld it and repeat this dogma effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 3))
        if (game.getTopCard(player, card.color)) {
          game.mLog({
            template: '{player} already has a top card of matching color',
            args: { player }
          })
          break
        }
        else {
          game.mLog({
            template: '{player} has no top cards of matching color',
          })
          game.aMeld(player, card)
        }
      }
    }
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
