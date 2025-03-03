const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Meteorology`  // Card names are unique in Innovation
  this.name = `Meteorology`
  this.color = `blue`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `sslh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {3}. If it has {l}, score it. Otherwise, if it has {c}, return it and draw two {3}. Otherwise, tuck it.`,
    `If you have no {k}, claim the Zen achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 3))
      if (card.checkHasBiscuit('l')) {
        game.aScore(player, card)
      }
      else if (card.checkHasBiscuit('c')) {
        game.aReturn(player, card)
        game.aDraw(player, { age: game.getEffectAge(this, 2) })
        game.aDraw(player, { age: game.getEffectAge(this, 2) })
      }
      else {
        game.aTuck(player, card)
      }
    },
    (game, player) => {
      const biscuits = game.getBiscuitsByPlayer(player)
      if (biscuits.k === 0) {
        game.aClaimAchievement(player, { name: 'Zen' })
      }
      else {
        game.mLogNoEffect()
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
