const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Globe`  // Card names are unique in Innovation
  this.name = `Globe`
  this.color = `green`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `f4fh`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return all cards in your hand. If you return blue, green, and yellow cards, draw and foreshadow a {6}, {7}, and {8}, then splay any color on your board right.`,
    `If Globe was foreseen, foreshadow a top card from any board.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const colorCheck = (cards) => {
        const tests = [
          cards.some(c => c.color === 'blue'),
          cards.some(c => c.color === 'green'),
          cards.some(c => c.color === 'yellow'),
        ]
        return tests.every(x => x)
      }

      const returnAll = game.aYesNo(player, 'Return all cards in your hand?')
      if (returnAll) {
        const returned = game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
        if (colorCheck(returned)) {
          // Prove that all three colors were returned.
          const toProve = returned.filter(x => x.color === 'yellow' || x.color === 'green' || x.color === 'blue')
          const toReveal = game.aChooseCards(player, toProve, {
            title: 'Choose a blue, green, and yellow card to reveal',
            count: 3,
            guard: (cards) => colorCheck(cards),
          })
          game.aRevealMany(player, toReveal, { ordered: true })

          game.aDrawAndForeshadow(player, game.getEffectAge(this, 6))
          game.aDrawAndForeshadow(player, game.getEffectAge(this, 7))
          game.aDrawAndForeshadow(player, game.getEffectAge(this, 8))

          game.aChooseAndSplay(player, game.utilColors(), 'right', { count: 1 })
        }
      }
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        const cards = game
          .getPlayerAll()
          .flatMap(p => game.getTopCards(p))
        game.aChooseAndForeshadow(player, cards, { count: 1 })
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
