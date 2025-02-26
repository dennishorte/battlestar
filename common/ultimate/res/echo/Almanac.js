const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Almanac`  // Card names are unique in Innovation
  this.name = `Almanac`
  this.color = `blue`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `hl4&`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {4}.`
  this.karma = []
  this.dogma = [
    `You may return a card from your forecast with a bonus. If you do, draw and score a card of value one higher than that bonus.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'forecast')
        .filter(card => card.checkHasBonus())

      const cards = game.aChooseAndReturn(player, choices, { min: 0, max: 1 })
      if (cards && cards.length > 0) {
        const card = cards[0]
        const bonuses = card.getBonuses()
        game.aDrawAndScore(player, bonuses[0] + 1)
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 4))
  }
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
