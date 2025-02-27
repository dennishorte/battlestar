const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hypersonics`  // Card names are unique in Innovation
  this.name = `Hypersonics`
  this.color = `green`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `iilh`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return exactly two top cards of different colors from your board of the same value! If you do, return all cards of that value or less in your hand and score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const valueMap = new Map()

      game.getTopCards(player).forEach(card => {
        const age = card.getAge()
        if (!valueMap.has(age)) {
          valueMap.set(age, [])
        }
        valueMap.get(age).push(card)
      })

      // Find values that have at least 2 cards of different colors
      const validValues = Array
        .from(valueMap.values())
        .filter(x => x.length >= 2)
        .map(x => x[0].getAge())
        .sort()

      if (validValues.length === 0) {
        game.mLog({
          template: '{player} has no valid pairs of cards to return',
          args: { player }
        })
        return
      }

      // Let player choose a value
      const chosenValue = game.aChooseAge(player, validValues, {
        title: 'Choose a value to return two cards of'
      })

      // Get cards of that value
      const cardsOfValue = game
        .getTopCards(player)
        .filter(x => x.getAge() === chosenValue)

      const returned = game.aChooseAndReturn(player, cardsOfValue, { count: 2, ordered: true })

      if (returned.length === 2) {
        // Return all cards of that value or less from hand and score
        const cardsToReturn = [
          ...game.getCardsByZone(player, 'hand').filter(c => c.getAge() <= chosenValue),
          ...game.getCardsByZone(player, 'score').filter(c => c.getAge() <= chosenValue)
        ]

        game.aReturnMany(player, cardsToReturn, { ordered: true })
      }
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
