const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Machine Gun`  // Card names are unique in Innovation
  this.name = `Machine Gun`
  this.color = `red`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `ff&h`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `If you have five top cards, draw and score a {7}.`
  this.karma = []
  this.dogma = [
    `I demand you transfer all of your top cards with a bonus to my score pile! If you transferred any, draw a {7}!`,
    `Return all your non-red top cards.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const toTransfer = game
        .getTopCards(player)
        .filter(card => card.checkHasBonus())
      const transferred = game.aTransferMany(player, toTransfer, game.getZoneByPlayer(leader, 'score'))

      if (transferred && transferred.length > 0) {
        game.aDraw(player, { age: game.getEffectAge(this, 7) })
      }
    },

    (game, player) => {
      const toReturn = game
        .getTopCards(player)
        .filter(card => card.color !== 'red')
      game.aReturnMany(player, toReturn)
    }
  ]
  this.echoImpl = (game, player) => {
    const topCards = game.getTopCards(player)
    if (topCards.length === 5) {
      game.aDrawAndScore(player, game.getEffectAge(this, 7))
    }
    else {
      game.log.addNoEffect()
    }
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
