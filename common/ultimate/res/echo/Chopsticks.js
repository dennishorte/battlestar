const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chopsticks`  // Card names are unique in Innovation
  this.name = `Chopsticks`
  this.color = `yellow`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hll&`
  this.dogmaBiscuit = `l`
  this.echo = `You may draw and foreshadow a {1}.`
  this.karma = []
  this.dogma = [
    `You may junk all cards in the {1} deck. If you do, achieve the highest card in the junk, if eligible.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const junked = game.aJunkDeck(player, 1, { optional: true })
      if (junked) {
        const choices = game
          .utilHighestCards(game.getZoneById('junk').cards())
          .filter(card => game.checkAchievementEligibility(player, card))
        game.aChooseAndAchieve(player, choices, { count: 1 })
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 1), { optional: true })
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
