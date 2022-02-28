const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Calendar`  // Card names are unique in Innovation
  this.name = `Calendar`
  this.color = `blue`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `hlls`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have more cards in your score pile than in your hand, draw two {3}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const scoreCount = game
        .getZoneByPlayer(player, 'score')
        .cards()
        .length
      const handCount = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .length

      if (scoreCount > handCount) {
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
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
