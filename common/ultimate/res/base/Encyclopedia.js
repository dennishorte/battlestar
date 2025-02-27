const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Encyclopedia`  // Card names are unique in Innovation
  this.name = `Encyclopedia`
  this.color = `blue`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a value. You may meld all the cards of that value in your score pile.`,
    `You may junk an available achievement of value 5, 6, or 7.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const values = game.getAgesByZone(player, 'score')

      if (values.length === 0) {
        game.mLog({ template: 'no cards in score' })
        return
      }

      const chosenValue = game.aChooseAge(player, values, {
        title: 'Optionally: choose an age to merge from your score',
        min: 0,
      })
      if (chosenValue) {
        const toMeld = game
          .getCardsByZone(player, 'score')
          .filter(c => c.getAge() === chosenValue)
        game.aMeldMany(player, toMeld)
      }
    },

    (game, player) => {
      game.aJunkAvailableAchievement(player, [5, 6, 7], { min: 0 })
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
