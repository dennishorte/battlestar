const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pagoda`  // Card names are unique in Innovation
  this.name = `Pagoda`
  this.color = `purple`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `k2hk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {3}. You may tuck another card of matching color from your hand. If you do, and Pagoda was foreseen, meld all cards of that color from all other boards.`
  ]

  this.dogmaImpl = [
    (game, player, { foreseen, self }) => {
      const hand = game.getCardsByZone(player, 'hand')
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 3))

      if (card) {
        const matching = hand.filter(other => other.color === card.color)
        const tucked = game.aChooseAndTuck(player, matching, { min: 0, max: 1 })[0]

        if (tucked && foreseen) {
          game.mLogWasForeseen(self)
          const toMeld = game
            .getPlayersOther(player)
            .flatMap(p => game.getCardsByZone(p, card.color))
          game.aMeldMany(player, toMeld)
        }
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
