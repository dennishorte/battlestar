const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Molasses Reef Caravel`  // Card names are unique in Innovation
  this.name = `Molasses Reef Caravel`
  this.color = `green`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. Draw three {4}. Meld a blue card from your hand. Score a card from your hand. Return a card from your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(this, 4) })
      game.aDraw(player, { age: game.getEffectAge(this, 4) })
      game.aDraw(player, { age: game.getEffectAge(this, 4) })

      const blueCards = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === 'blue')
      if (blueCards.length > 0) {
        game.aChooseAndMeld(player, blueCards)
      }
      else {
        game.mLog({
          template: '{player} has no blue cards',
          args: { player }
        })
      }
      game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
      game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'))
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
