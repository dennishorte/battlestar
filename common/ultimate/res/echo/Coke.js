const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Coke`  // Card names are unique in Innovation
  this.name = `Coke`
  this.color = `red`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `&ffh`
  this.dogmaBiscuit = `f`
  this.echo = `Draw and tuck a {4}.`
  this.karma = []
  this.dogma = [
    `Draw and reveal a {6}. If it has a {f}, meld it and repeat this dogma effect. Otherwise, foreshadow it.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      while (true) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
        if (card) {
          if (card.checkHasBiscuit('f')) {
            game.mLog({ template: 'Card has {f}.' })
            game.aMeld(player, card)
            continue
          }
          else {
            game.mLog({ template: 'Card did not have {f}.' })
            game.aForeshadow(player, card)
            break
          }
        }
        else {
          break
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 4))
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
