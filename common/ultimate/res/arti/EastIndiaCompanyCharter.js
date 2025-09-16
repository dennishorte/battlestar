const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `East India Company Charter`  // Card names are unique in Innovation
  this.name = `East India Company Charter`
  this.color = `red`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `cffh`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a value other than {5}. Return all cards of that value from all score piles. For each player that returned cards, draw and score a {5}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const age = game.aChooseAge(player, [1,2,3,4, /*5,*/ 6,7,8,9,10])
      const toReturn = []
      const playerCards = {}
      for (const player of game.getPlayerAll()) {
        const cards = game
          .getCardsByZone(player, 'score')
          .filter(card => card.getAge() === age)
        if (cards.length > 0) {
          toReturn.push(cards)
          playerCards[player.name] = cards
        }
      }

      const returned = game.aReturnMany(player, toReturn.flat())

      let count = 0
      for (const [player, cards] of Object.entries(playerCards)) {
        if (cards.some(card => returned.includes(card))) {
          count += 1
        }
      }

      for (let i = 0; i < count; i++) {
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
      }
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
