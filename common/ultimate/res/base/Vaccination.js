const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Vaccination`  // Card names are unique in Innovation
  this.name = `Vaccination`
  this.color = `yellow`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `lflh`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you choose a card in your score pile! Return all cards from your score pile of its value. If you do, draw and meld a {6}!`,
    `If any card was returned as a result of the demand, draw and meld a {7}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const values = game.getAgesByZone(player, 'score')

      if (values.length === 0) {
        game.mLog({ template: 'no cards in score' })
        return
      }

      const chosenValue = game.aChooseAge(player, values)
      const toReturn = game
        .getCardsByZone(player, 'score')
        .filter(c => c.getAge() === chosenValue)

      const returned = game.aReturnMany(player, toReturn)

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
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
