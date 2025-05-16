const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stem Cells`  // Card names are unique in Innovation
  this.name = `Stem Cells`
  this.color = `yellow`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may score all cards from your hand.`,
    `Draw an {e}.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand')
      if (hand.cards().length === 0) {
        game.log.addNoEffect()
        return
      }

      const scoreAll = game.aYesNo(player, 'Score all cards from your hand?')

      if (scoreAll) {
        game.aScoreMany(player, hand.cards())
      }
      else {
        game.log.addDoNothing(player)
      }
    },

    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 11) })
    },
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
