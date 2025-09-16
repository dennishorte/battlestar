const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Along the River during the Qingming Festival`  // Card names are unique in Innovation
  this.name = `Along the River during the Qingming Festival`
  this.color = `yellow`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {4}. If it is yellow, tuck it. If it is purple, score it. Otherwise, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 4))
        if (card.color === 'yellow') {
          game.aTuck(player, card)
          break
        }
        else if (card.color === 'purple') {
          game.aScore(player, card)
          break
        }
        else {
          game.mLog({
            template: 'Card is neither yellow nor purple. Repeating effect.'
          })
          continue
        }
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
