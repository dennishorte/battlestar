const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = `Safety Pin`  // Card names are unique in Innovation
  this.name = `Safety Pin`
  this.color = `yellow`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `h&ll`
  this.dogmaBiscuit = `l`
  this.isSpecialAchievement = true
  this.isRelic = true
  this.inspire = ``
  this.echo = `Draw and score a {7}.`
  this.karma = []
  this.dogma = [
    `I demand you return all cards of value higher than 6 from your hand! Draw a {6}!`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toReturn = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() > 6)
      game.aReturnMany(player, toReturn)
      game.aDraw(player, { age: game.getEffectAge(this, 6) })
    }
  ]
  this.echoImpl = [
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 7))
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
