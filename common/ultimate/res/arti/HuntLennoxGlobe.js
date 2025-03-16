const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hunt-Lennox Globe`  // Card names are unique in Innovation
  this.name = `Hunt-Lennox Globe`
  this.color = `green`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have fewer than four cards in your hand, return all non-green top cards from your board. Draw a {5} for each card returned. Meld a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (game.getCardsByZone(player, 'hand').length < 4) {
        game.mLog({ template: 'Player has fewer than 4 cards in hand.' })
        const toReturn = game
          .getTopCards(player)
          .filter(card => card.color !== 'green')
        const returned = game.aReturnMany(player, toReturn)
        if (returned) {
          for (let i = 0; i < returned.length; i++) {
            game.aDraw(player, { age: game.getEffectAge(this, 5) })
          }
        }
      }
      else {
        game.mLog({ template: 'Player has 4 or more cards in hand' })
      }

      game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
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
