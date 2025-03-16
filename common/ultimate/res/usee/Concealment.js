const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Concealment`  // Card names are unique in Innovation
  this.name = `Concealment`
  this.color = `red`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hffi`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you tuck all your secrets!`,
    `Safeguard your bottom purple card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aTuckMany(player, game.getCardsByZone(player, 'safe'))
    },
    (game, player) => {
      const bottomPurpleCard = game
        .getBottomCards(player)
        .find(card => card.color === 'purple')

      if (bottomPurpleCard) {
        game.aSafeguard(player, bottomPurpleCard)
      }
      else {
        game.mLog({
          template: '{player} has no bottom purple card',
          args: { player }
        })
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
