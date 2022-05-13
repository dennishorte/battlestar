const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `International Prototype Metre Bar`  // Card names are unique in Innovation
  this.name = `International Prototype Metre Bar`
  this.color = `green`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `chcf`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a value. Draw and meld a card of that value. Splay up the color of the melded card. If the number of cards of that color visible on your board is exactly equal to the card's value, you win. Otherwise, return the melded card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const age = game.aChooseAge(player)
      const card = game.aDrawAndMeld(player, age)
      game.aSplay(player, card.color, 'up')

      if (game.getCardsByZone(player, card.color).length === card.getAge()) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        game.aReturn(player, card)
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
