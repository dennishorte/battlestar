const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Laser`  // Card names are unique in Innovation
  this.name = `Laser`
  this.color = `blue`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `sshl`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all unclaimed standard achievements. Then, return half (rounded up) of the cards in your score pile. Draw and meld two {0}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toReturn = game
        .getZoneById('achievements')
        .cards()
        .filter(card => !card.isSpecialAchievement)
      game.aReturnMany(player, toReturn, { ordered: true })

      const score = game.getCardsByZone(player, 'score')
      const returnCount = Math.ceil(score.length / 2)
      game.aChooseAndReturn(player, score, { count: returnCount })

      game.aDrawAndMeld(player, game.getEffectAge(this, 10))
      game.aDrawAndMeld(player, game.getEffectAge(this, 10))
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
