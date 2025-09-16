const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Frigate Constitution`  // Card names are unique in Innovation
  this.name = `Frigate Constitution`
  this.color = `red`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to reveal a card in your hand! If you do, and its value is equal to the value of any of my top cards, return it and all cards of its color from your board.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const card = game.aChooseCard(player, game.getCardsByZone(player, 'hand'))

      if (card) {
        game.mReveal(player, card)

        const matchingAges = game
          .getTopCards(leader)
          .filter(other => other.getAge() === card.age)

        if (matchingAges.length === 0) {
          game.mLog({
            template: "Card age does not match any of {player}'s top cards",
            args: { player: leader }
          })
        }
        else {
          const toReturn = game.getCardsByZone(player, card.color)
          toReturn.push(card)
          game.aReturnMany(player, toReturn)
        }
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
