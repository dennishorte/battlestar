const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Colt Paterson Revolver`  // Card names are unique in Innovation
  this.name = `Colt Paterson Revolver`
  this.color = `yellow`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `fhfc`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    // `I compel you to reveal your hand! Draw a {7}! If the color of the drawn card matches the color of any other card in your hand, return all cards in your hand and all cards in your score pile!`
    `I compel you to draw and reveal a {7}! If the color of the drawn card matches the color of any other card in your hand, return all cards in your hand and all cards in your score pile!`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const preDrawHand = game.getCardsByZone(player, 'hand')
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 7))

      if (preDrawHand.some(other => other.color === card.color)) {
        game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
        game.aReturnMany(player, game.getCardsByZone(player, 'score'))
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
