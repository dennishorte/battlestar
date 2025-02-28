const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Private Eye`  // Card names are unique in Innovation
  this.name = `Private Eye`
  this.color = `blue`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `llsh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal your hand! Transfer the card in your hand of my choice to my board! Draw a {7}!`,
    `Score one of your secrets.`,
    `You may splay your blue cards right.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const opponentHand = game.getZoneByPlayer(player, 'hand').cards()
      game.mRevealHand(player)
      
      if (opponentHand.length > 0) {
        const card = game.aChooseCard(leader, opponentHand)
        if (card) {
          game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
          game.aDraw(leader, { age: game.getEffectAge(this, 7) })
        }
      }
    },
    (game, player) => {
      const secrets = game.getCardsByZone(player, 'secrets')
      if (secrets.length > 0) {
        const card = game.aChooseCard(player, secrets)
        if (card) {
          game.aScore(player, card)
        }
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
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