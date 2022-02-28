const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stephen Hawking`  // Card names are unique in Innovation
  this.name = `Stephen Hawking`
  this.color = `blue`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `b*sh`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw and tuck a {0}.`
  this.echo = ``
  this.karma = [
    `Each HEX on your board also counts as an echo effect reading "Score the bottom card of this color".`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 10))
  }
  this.karmaImpl = [
    {
      trigger: 'hex-effect',
      triggerAll: true,
      matches: (game, player, { card }) => {
        // Only affects cards that are on the same board as Stephen Hawking.
        return game.getPlayerByCard(this) === game.getPlayerByCard(card)
      },

      // Note that player here is the owner of Stephen Hawking and card is a card in a stack
      // that has a visible hex, and so gets this extra echo effect.
      func: (game, player, { card }) => {
        return {
          text: 'Score the bottom card of this color.',
          impl: (game, player) => {
            const cards = game.getZoneByPlayer(player, card.color).cards()
            if (cards.length === 0) {
              game.mLogNoEffect()
            }
            else {
              game.aScore(player, cards[cards.length - 1])
            }
          }
        }
      }
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
