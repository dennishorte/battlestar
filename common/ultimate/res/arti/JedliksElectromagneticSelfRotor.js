const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jedlik's Electromagnetic Self-Rotor`  // Card names are unique in Innovation
  this.name = `Jedlik's Electromagnetic Self-Rotor`
  this.color = `red`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `hiss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score an {8}. Draw and meld an {8}. Claim an achievement of value 8 if it is available, ignoring eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 8))
      game.aDrawAndMeld(player, game.getEffectAge(this, 8))

      const choices = game
        .getAvailableAchievementsRaw(player)
        .filter(ach => ach.age === 8)

      game.aChooseAndAchieve(player, choices)
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
