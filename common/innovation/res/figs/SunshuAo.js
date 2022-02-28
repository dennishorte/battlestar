const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sunshu Ao`  // Card names are unique in Innovation
  this.name = `Sunshu Ao`
  this.color = `yellow`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `h1*k`
  this.dogmaBiscuit = `k`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `If you would tuck a yellow card, instead meld it and execute all of the non-demand Dogma effects on it for yourself only, then return it to your hand if it is still a top card on your board.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'tuck',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.color === 'yellow',
      func: (game, player, { card }) => {
        game.aMeld(player, card)
        game.aCardEffects(player, player, card, 'dogma', game.getBiscuits())

        if (game.checkCardIsTop(card)) {
          game.mLog({
            template: '{player} returns {card} to hand',
            args: { player, card }
          })
          game.mMoveCardTo(card, game.getZoneByPlayer(player, 'hand'))
        }
      },
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
