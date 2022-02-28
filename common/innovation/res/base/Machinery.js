const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Machinery`  // Card names are unique in Innovation
  this.name = `Machinery`
  this.color = `yellow`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `llhk`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you exchange all the cards in your hand with all the highest cards in my hand!`,
    `Score a card from your hand with a {k}.`,
    `You may splay your red cards left.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const yours = game.getCardsByZone(player, 'hand')
      const mine = game.utilHighestCards(game.getCardsByZone(leader, 'hand'))
      for (const card of yours) {
        game.mMoveCardTo(card, game.getZoneByPlayer(leader, 'hand'))
      }
      for (const card of mine) {
        game.mMoveCardTo(card, game.getZoneByPlayer(player, 'hand'))
      }
    },

    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      game.aChooseAndScore(player, choices)
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'left')
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
