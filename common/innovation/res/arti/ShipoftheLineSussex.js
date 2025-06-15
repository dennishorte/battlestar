const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ship of the Line Sussex`  // Card names are unique in Innovation
  this.name = `Ship of the Line Sussex`
  this.color = `red`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `ffhf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have no cards in your score pile, choose a color and score all cards of that color from your board. Otherwise, return all cards from your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      if (game.getCardsByZone(player, 'score').length === 0) {
        const colors = game.actions.choose(player, game.utilColors(), { title: 'Choose a Color' })
        const color = colors[0]
        game.aScoreMany(player, game.getCardsByZone(player, color))
      }

      else {
        game.aReturnMany(player, game.getCardsByZone(player, 'score'))
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
