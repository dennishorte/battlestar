const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Morphine`  // Card names are unique in Innovation
  this.name = `Morphine`
  this.color = `yellow`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `sh7&`
  this.dogmaBiscuit = `s`
  this.echo = `Score an odd-valued card from your hand.`
  this.karma = []
  this.dogma = [
    `I demand you return all odd-valued cards in your hand! Draw a {6}!`,
    `Draw a card of value one higher than the highest card returned due to the demand, if any were returned.`,
    `You may splay your red cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toReturn = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() % 2 === 1)
      const returned = game.aReturnMany(player, toReturn)
      game.aDraw(player, { age: game.getEffectAge(this, 6) })

      if (!game.state.dogmaInfo.morphine) {
        game.state.dogmaInfo.morphine = 0
      }
      if (returned) {
        game.state.dogmaInfo.morphine = Math.max(
          game.state.dogmaInfo.morphine,
          ...returned.map(card => card.getAge())
        )
      }
    },

    (game, player) => {
      if (game.state.dogmaInfo.morphine) {
        game.aDraw(player, { age: game.state.dogmaInfo.morphine + 1 })
      }
      else {
        game.mLog({ template: 'No cards were returned due to the demand.' })
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'right')
    },
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getCardsByZone(player, 'hand')
      .filter(card => card.getAge() % 2 === 1)
    game.aChooseAndScore(player, choices)
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
