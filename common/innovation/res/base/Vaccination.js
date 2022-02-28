const CardBase = require(`../CardBase.js`)
const util = require('../../util.js')

function Card() {
  this.id = `Vaccination`  // Card names are unique in Innovation
  this.name = `Vaccination`
  this.color = `yellow`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `lflh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return all the lowest cards in your score pile! If you returned any, draw and meld a {6}!`,
    `If any card was returned as a result of the demand, draw and meld a {7}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game
        .getCardsByZone(player, 'score')
        .sort((l, r) => l.age - r.age)
      const lowest = util.array.takeWhile(cards, card => card.age === cards[0].age)
      const returned = game.aReturnMany(player, lowest)

      if (returned.length > 0) {
        game.aDrawAndMeld(player, game.getEffectAge(this, 6))
        game.state.dogmaInfo.vaccinationCardWasReturned = true
      }
    },
    (game, player) => {
      if (game.state.dogmaInfo.vaccinationCardWasReturned) {
        game.aDrawAndMeld(player, game.getEffectAge(this, 7))
      }
      else {
        game.mLogNoEffect()
      }
    },
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
