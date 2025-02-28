const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Concealment`  // Card names are unique in Innovation
  this.name = `Concealment`
  this.color = `red`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hffi` 
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you tuck all your secrets!`,
    `Safeguard your bottom purple card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const secrets = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('f'))
      
      if (secrets.length > 0) {
        game.mLogIndent()
        game.mLogIndent()
        secrets.forEach(secret => {
          game.mLog({
            template: '{player} tucks {card}',
            args: { player, card: secret }
          })
          game.aTuck(player, secret)
        })
        game.mLogOutdent()
        game.mLogOutdent()
      }
      else {
        game.mLog({
          template: '{player} has no secrets to tuck',
          args: { player }
        })
      }
    },
    (game, player) => {
      const bottomPurpleCard = game
        .getBottomCards(player)
        .find(card => card.color === 'purple')

      if (bottomPurpleCard) {
        game.mLog({
          template: '{player} safeguards {card}',
          args: { player, card: bottomPurpleCard }
        })
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