const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hansen Writing Ball`  // Card names are unique in Innovation
  this.name = `Hansen Writing Ball`
  this.color = `green`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `ilih`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to draw four {7}! Meld a blue card, then transfer all cards in your hand to my hand!`,
    `Draw and reveal a {7}. If it has no {i}, tuck it and repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      for (let i = 0; i < 4; i++) {
        game.aDraw(player, { age: game.getEffectAge(this, 7) })
      }

      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === 'blue')

      game.aChooseAndMeld(player, choices)

      game.aTransferMany(
        player,
        game.getCardsByZone(player, 'hand'),
        game.getZoneByPlayer(leader, 'hand'),
        { ordered: true },
      )
    },

    (game, player) => {
      while (true) {
        const card = game.aDrawAndReveal(player, game.getEffectAge(this, 7))
        if (card) {
          if (card.checkHasBiscuit('i')) {
            game.mLog({ template: 'Card has a {i} biscuit' })
            break
          }
          else {
            game.mLog({ template: 'Card does not have a {i} biscuit' })
            game.aTuck(player, card)
          }
        }
      }
    },
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
